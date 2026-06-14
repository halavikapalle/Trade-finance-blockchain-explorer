from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(String, nullable=False)

    role = Column(String)

    role = Column(
        String,
        default="employee"
    )

    org_name = Column(String)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    