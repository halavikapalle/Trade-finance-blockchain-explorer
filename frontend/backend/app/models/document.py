from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database import Base


class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)

    document_type = Column(String, nullable=False)

    file_path = Column(String, nullable=False)

    uploaded_by = Column(Integer)

    file_hash = Column(String)