import os
import shutil
import uuid
import requests
import hashlib
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.trade_document import TradeDocument


from app.middleware.auth_middleware import get_current_user

from app.blockchain.hash_service import generate_file_hash
from app.models.audit_log import AuditLog



from app.services.audit_service import create_audit_log
from app.services.ledger_service import create_ledger_entry
from app.models.ledger_entry import LedgerEntry
from app.services.cloudinary_service import upload_file


router = APIRouter(
    prefix="/documents",
    tags=["Trade Documents"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ---------------------------
# VERIFY DOCUMENT
# ---------------------------
@router.get("/verify/{document_id}")
def verify_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    document = db.query(TradeDocument).filter(
        TradeDocument.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not document.file_url:
        raise HTTPException(
            status_code=400,
            detail="No Cloudinary URL found"
        )

    response = requests.get(document.file_url)

    if response.status_code != 200:
        raise HTTPException(
            status_code=404,
            detail="Unable to fetch document from Cloudinary"
        )

    print("FILE URL:", document.file_url)

    file_bytes = requests.get(document.file_url).content

    print("DOWNLOADED BYTES:", len(file_bytes))

    current_hash = hashlib.sha256(file_bytes).hexdigest()

    print("STORED HASH:", document.blockchain_hash)
    print("CURRENT HASH:", current_hash)

    verification_status = (
        "VALID"
        if current_hash == document.blockchain_hash
        else "TAMPERED"
    )

    document.is_verified = (
        verification_status == "VALID"
    )

    document.status = (
        "Verified"
        if verification_status == "VALID"
        else "Tampered"
    )

    db.commit()

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="VERIFY_DOCUMENT",
        details=f"Verified document ID {document.id}"
    )

    create_ledger_entry(
        db=db,
        document_id=document.id,
        actor_id=current_user.id,
        action="VERIFY_DOCUMENT",
        event_details=f"Verified document {document.id}"
    )

    return {
        "document_id": document.id,
        "file_name": document.file_name,
        "stored_hash": document.blockchain_hash,
        "current_hash": current_hash,
        "verification_status": verification_status
    }
# ---------------------------
# UPLOAD DOCUMENT
# ---------------------------
@router.post("/upload")
def upload_document(
    title: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    print("UPLOAD API CALLED")

    # 1. Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files allowed"
        )

    
    file.file.seek(0)

    content = file.file.read()

    blockchain_hash = hashlib.sha256(content).hexdigest()

    file.file.seek(0)

    file_url, public_id = upload_file(file)
    print("FILE URL:", file_url)
    print("PUBLIC ID:", public_id)
    
    new_document = TradeDocument(
        title=title,
        document_type=document_type,
        file_name=file.filename,
        file_path=public_id,
        file_url=file_url,  
        blockchain_hash=blockchain_hash,
        uploaded_by=current_user.id
    )

    db.add(new_document)
    db.commit()
    db.refresh(new_document)
    print("NEW DOC ID:", new_document.id)
    saved_doc = db.query(TradeDocument).filter(
        TradeDocument.id == new_document.id
    ).first()

    print("FOUND DOC:", saved_doc)
    create_ledger_entry(
        db=db,
        document_id=new_document.id,
        actor_id=current_user.id,
        action="UPLOAD_DOCUMENT",
        event_details=f"Uploaded {new_document.title}"
    )
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="UPLOAD_DOCUMENT",
        details=f"Uploaded document {new_document.title}"
    )

    return {
        "message": "PDF uploaded successfully",
        "document_id": new_document.id,
        "file_name": file.filename,
        "blockchain_hash": blockchain_hash
    }
# ---------------------------
# GET AUDIT LOGS
# ---------------------------
@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    logs = db.query(AuditLog).all()

    return logs



# ---------------------------
# DOWNLOAD DOCUMENT
# ---------------------------
@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    print("DOWNLOAD API HIT")
    print("DOCUMENT ID:", document_id)
    print("CURRENT USER:", current_user.id)

    document = db.query(TradeDocument).filter(
        TradeDocument.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    create_audit_log(
    db=db,
    user_id=current_user.id,
    action="DOWNLOAD_DOCUMENT",
    details=f"Downloaded document ID {document.id}"
)

    create_ledger_entry(
        db=db,
        document_id=document.id,
        actor_id=current_user.id,
        action="DOWNLOAD_DOCUMENT",
        event_details=f"Downloaded document {document.id}"
    )

    return {
        "download_url": document.file_url
    }

    
# ---------------------------
# DELETE DOCUMENT
# ---------------------------
@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    document = db.query(TradeDocument).filter(
        TradeDocument.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    
    
    # AUDIT LOG
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="DELETE_DOCUMENT",
        details=f"Deleted document ID {document.id}"
        )

    
    create_ledger_entry(
        db=db,
        document_id=document.id,
        actor_id=current_user.id,
        action="DELETE_DOCUMENT",
        event_details=f"Deleted document {document.id}"
        )
   
    db.query(LedgerEntry).filter(
        LedgerEntry.document_id == document.id
    ).delete()
        # DELETE FROM DATABASE
    db.delete(document)

    db.commit()

    return {
        "message": "Document deleted successfully"
    }

#---------------------------------------
@router.get("/")
def get_all_documents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    documents = db.query(
    TradeDocument
    ).order_by(
        TradeDocument.id.asc()
    ).all()
    return documents

#-------------------------
@router.get("/ledger")
def get_ledger(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    documents = db.query(
        TradeDocument
    ).all()

    ledger_data = []

    for doc in documents:

        ledger_data.append({

            "id": doc.id,
            "title": doc.title,
            "document_type": doc.document_type,
            "hash": doc.blockchain_hash,
            "file_name": doc.file_name

        })

    return ledger_data


#---------recent-activity------
@router.get("/recent-activity")
def recent_activity(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    logs = db.query(
        AuditLog
    ).order_by(
        AuditLog.created_at.desc()
    ).limit(10).all()

    return logs

#---------search-----------
@router.get("/search")
def search_documents(
    document_type: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(TradeDocument)

    if document_type:
        query = query.filter(
            TradeDocument.document_type == document_type
        )

    return query.all()

