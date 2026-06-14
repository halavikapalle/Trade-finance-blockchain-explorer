from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func

from app.database import Base


class AuditLog(Base):

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, nullable=False)

    action = Column(String, nullable=False)

    details = Column(String)

    hash = Column(String, nullable=False)

    previous_hash = Column(String)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )