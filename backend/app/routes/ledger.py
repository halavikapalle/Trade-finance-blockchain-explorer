from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ledger_entry import LedgerEntry

router = APIRouter(
    prefix="/ledger",
    tags=["Ledger"]
)


@router.get("/")
def get_ledger(
    db: Session = Depends(get_db)
):

    return db.query(
        LedgerEntry
    ).order_by(
        LedgerEntry.created_at.desc()
    ).all()