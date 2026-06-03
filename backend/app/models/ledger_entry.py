from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func

from app.database import Base


class LedgerEntry(Base):

    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True)

    document_id = Column(
        Integer,
        ForeignKey("trade_documents.id")
    )

    actor_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    action = Column(String)

    event_details = Column(String)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )