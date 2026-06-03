from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.trade_document import TradeDocument
from app.models.audit_log import AuditLog

from app.middleware.auth_middleware import get_current_user
from app.models.trade_transaction import TradeTransaction

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    total_documents = db.query(TradeDocument).count()
    total_transactions = db.query(TradeTransaction).count()
    verified_documents = db.query(TradeDocument).filter(
        TradeDocument.is_verified == True
    ).count()

    total_audit_logs = db.query(AuditLog).count()

    document_types = db.query(
        TradeDocument.document_type,
        func.count(TradeDocument.id)
    ).group_by(TradeDocument.document_type).all()

    document_type_dict = dict(document_types)
    pending_transactions = db.query(TradeTransaction).filter(
        TradeTransaction.status == "pending"
    ).count()

    completed_transactions = db.query(TradeTransaction).filter(
        TradeTransaction.status == "completed"
    ).count()

    failed_transactions = db.query(TradeTransaction).filter(
        TradeTransaction.status == "failed"
    ).count()
    avg_risk_score = db.query(
        func.avg(TradeTransaction.risk_score)
    ).scalar()

    avg_risk_score = float(avg_risk_score) if avg_risk_score else 0
    status_counts = db.query(
        TradeTransaction.status,
        func.count(TradeTransaction.id)
    ).group_by(
        TradeTransaction.status
    ).all()
    status_dict = dict(status_counts)
    total_volume = db.query(
        func.sum(TradeTransaction.amount)
    ).scalar()

    total_volume = float(total_volume or 0)
    return {
    "total_documents": total_documents,
    "verified_documents": verified_documents,
    "total_audit_logs": total_audit_logs,
    "document_types": document_type_dict,

    "total_transactions": total_transactions,
    "pending_transactions": pending_transactions,
    "completed_transactions": completed_transactions,
    "failed_transactions": failed_transactions,

    "average_risk_score": avg_risk_score
}
    