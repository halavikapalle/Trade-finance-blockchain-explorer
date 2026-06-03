from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import TIMESTAMP

from sqlalchemy.sql import func

from app.database import Base
from sqlalchemy import Boolean

class TradeDocument(Base):

    __tablename__ = "trade_documents"

    id = Column(
        Integer,
        primary_key=True
    )

    title = Column(
        String,
        nullable=False
    )

    document_type = Column(
        String,
        nullable=False
    )

    file_name = Column(
        String,
        nullable=False
    )
    file_path = Column(
    String
    )

    blockchain_hash = Column(
        String
    )

    is_verified = Column(Boolean, default=False)
    status = Column(
        String,
        default="Pending"
    )

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )