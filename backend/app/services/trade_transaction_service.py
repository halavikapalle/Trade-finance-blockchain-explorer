from app.models.trade_transaction import TradeTransaction
from app.database import SessionLocal


def create_transaction(db, data):
    transaction = TradeTransaction(
        buyer_id=data.buyer_id,
        seller_id=data.seller_id,
        amount=data.amount,
        currency=data.currency,
        status="pending"
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions(db):
    return db.query(TradeTransaction).all()


def get_transaction_by_id(db, tx_id):
    return db.query(TradeTransaction).filter(TradeTransaction.id == tx_id).first()


def update_status(db, tx_id, status):
    tx = db.query(TradeTransaction).filter(TradeTransaction.id == tx_id).first()

    if not tx:
        return None

    tx.status = status
    db.commit()
    db.refresh(tx)
    return tx