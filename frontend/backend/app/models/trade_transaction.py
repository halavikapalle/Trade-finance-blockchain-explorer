
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func

from sqlalchemy import Column, Integer, ForeignKey, Numeric, String, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base


class TradeTransaction(Base):

    __tablename__ = "trade_transactions"

    id = Column(Integer, primary_key=True, index=True)

    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Numeric(12, 2), nullable=False)

    currency = Column(String(3), nullable=False, default="INR")

    status = Column(String(20), nullable=False, default="pending")

    created_at = Column(TIMESTAMP, server_default=func.now())

    risk_score = Column(Numeric(5, 2), default=0)    
    updated_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )