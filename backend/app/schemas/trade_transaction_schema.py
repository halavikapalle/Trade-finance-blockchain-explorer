from pydantic import BaseModel


class TradeTransactionCreate(BaseModel):

    buyer_id: int
    seller_id: int
    amount: float
    currency: str


class TransactionStatusUpdate(BaseModel):

    status: str