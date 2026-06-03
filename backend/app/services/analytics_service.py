from sqlalchemy.orm import Session
from app.models.trade_transaction import TradeTransaction
from sqlalchemy import func


def get_transaction_summary(db: Session):

    total = db.query(TradeTransaction).count()

    pending = db.query(TradeTransaction).filter(
        TradeTransaction.status == "pending"
    ).count()

    completed = db.query(TradeTransaction).filter(
        TradeTransaction.status == "completed"
    ).count()

    failed = db.query(TradeTransaction).filter(
        TradeTransaction.status == "failed"
    ).count()

    avg_risk = db.query(
        func.avg(TradeTransaction.risk_score)
    ).scalar()

    return {
        "total_transactions": total,
        "pending": pending,
        "completed": completed,
        "failed": failed,
        "average_risk_score": float(avg_risk or 0)
    }