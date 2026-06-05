from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.trade_transaction import TradeTransaction
from app.schemas.trade_transaction_schema import (
    TradeTransactionCreate,
    TransactionStatusUpdate
)

from app.services.audit_service import create_audit_log
from app.services.ledger_service import create_ledger_entry
from app.services.risk_service import calculate_risk

router = APIRouter(
    prefix="/transactions",
    tags=["Trade Transactions"]
)


# =========================
# CREATE TRANSACTION
# =========================
@router.post("/")
def create_transaction(
    transaction: TradeTransactionCreate,
    db: Session = Depends(get_db)
):

    new_transaction = TradeTransaction(
    buyer_id=transaction.buyer_id,
    seller_id=transaction.seller_id,
    amount=transaction.amount,
    currency=transaction.currency,
    status="pending",
    risk_score=risk_score
)

    new_transaction.risk_score = calculate_risk_score(new_transaction)
    risk_score = calculate_risk(transaction.amount, "pending")
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    create_audit_log(
        db=db,
        user_id=1,
        action="CREATE_TRANSACTION",
        details=f"Created transaction {new_transaction.id}"
    )

    create_ledger_entry(
        db=db,
        document_id=None,
        actor_id=1,
        action="CREATE_TRANSACTION",
        event_details=f"Transaction {new_transaction.id} created"
    )

    return {
        "message": "Transaction created",
        "transaction_id": new_transaction.id
    }


# =========================
# GET ALL TRANSACTIONS
# =========================
@router.get("/")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(TradeTransaction).all()


# =========================
# UPDATE STATUS
# =========================
@router.put("/{transaction_id}/status")
def update_transaction_status(
    transaction_id: int,
    data: TransactionStatusUpdate,
    db: Session = Depends(get_db)
):

    transaction = db.query(TradeTransaction).filter(
        TradeTransaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    transaction.status = data.status
    transaction.risk_score = calculate_risk_score(transaction)
    db.commit()
    db.refresh(transaction)

    create_audit_log(
        db=db,
        user_id=1,
        action="UPDATE_TRANSACTION",
        details=f"Transaction {transaction.id} updated to {data.status}"
    )

    create_ledger_entry(
        db=db,
        document_id=None,
        actor_id=1,
        action="UPDATE_TRANSACTION",
        event_details=f"Transaction {transaction.id} -> {data.status}"
    )

    return {
        "message": "Status updated successfully",
        "transaction_id": transaction.id,
        "status": transaction.status
    }



@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(TradeTransaction)
        .filter(TradeTransaction.id == transaction_id)
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    db.delete(transaction)
    db.commit()

    return {
        "message": "Transaction deleted successfully"
    }