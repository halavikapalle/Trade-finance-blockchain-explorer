from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.trade_document import TradeDocument
from app.models.audit_log import AuditLog

from app.middleware.auth_middleware import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    total_documents = db.query(
        TradeDocument
    ).count()

    total_audit_logs = db.query(
        AuditLog
    ).count()

    verified_documents = db.query(
    TradeDocument
    ).filter(
        TradeDocument.is_verified == True
    ).count()
    

    return {
        "total_documents": total_documents,
        "verified_documents": verified_documents,
        "total_audit_logs": total_audit_logs
    }