from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.trade_transaction import TradeTransaction

from app.middleware.auth_middleware import get_current_user


router = APIRouter(
    prefix="/risk",
    tags=["Risk Analysis"]
)


@router.get("/")
def get_risk_analysis(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    transactions = db.query(
        TradeTransaction
    ).all()

    risk_results = []

    for transaction in transactions:

        risk_score = 0

        # High amount
        if transaction.amount > 100000:
            risk_score += 40

        # Unusual currency
        if transaction.currency not in ["USD", "EUR"]:
            risk_score += 20

        # Pending transaction
        if transaction.status.lower() == "pending":
            risk_score += 20

        # Risk level
        if risk_score >= 60:
            risk_level = "HIGH_RISK"

        elif risk_score >= 30:
            risk_level = "MEDIUM_RISK"

        else:
            risk_level = "LOW_RISK"

        risk_results.append({

            "id": transaction.id,
            "title": f"Transaction {transaction.id}",
            "document_type": transaction.currency,
            "amount": float(transaction.amount),
            "status": transaction.status,
            "risk_score": risk_score,
            "risk_status": risk_level

        })

    return risk_results