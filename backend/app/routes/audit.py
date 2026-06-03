import hashlib
import json
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

import csv
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.audit_log import AuditLog

from app.middleware.auth_middleware import get_current_user


from app.utils.role_checker import role_required
router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)


@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    # ADMIN CHECK
    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    logs = db.query(
        AuditLog
    ).all()

    return logs
router = APIRouter(
    prefix="/audit",
    tags=["Audit Explorer"]
)


@router.get("/logs")
def get_all_logs(
    current_user = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):

    logs = db.query(AuditLog).all()

    return logs

@router.get("/verify-chain")
def verify_blockchain(db: Session = Depends(get_db)):

    logs = db.query(AuditLog).order_by(
        AuditLog.id.asc()
    ).all()

    if not logs:
        return {
            "message": "No audit logs found"
        }

    for i in range(1, len(logs)):

        current_log = logs[i]

        previous_log = logs[i - 1]

        # verify previous hash link
        if current_log.previous_hash != previous_log.hash:

            return {
                "status": "FAILED",
                "message": f"Blockchain broken at block {current_log.id}"
            }

    return {
        "status": "SUCCESS",
        "message": "Blockchain integrity verified"
    }
@router.get("/export")
def export_audit_logs(
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).all()

    filename = "audit_logs.csv"

    with open(filename, "w", newline="") as file:
        writer = csv.writer(file)

        writer.writerow([
            "ID",
            "User ID",
            "Action",
            "Details",
            "Created At"
        ])

        for log in logs:
            writer.writerow([
                log.id,
                log.user_id,
                log.action,
                log.details,
                log.created_at
            ])

    return FileResponse(
        filename,
        media_type="text/csv",
        filename="audit_logs.csv"
    )