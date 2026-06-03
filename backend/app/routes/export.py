from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.export_service import export_transactions_csv

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)
@router.get("/transactions")
def export_transactions(db: Session = Depends(get_db)):

    csv_file = export_transactions_csv(db)

    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=transactions.csv"
        }
    )