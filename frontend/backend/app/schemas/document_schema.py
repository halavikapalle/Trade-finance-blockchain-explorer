from pydantic import BaseModel


class DocumentCreate(BaseModel):

    title: str

    document_type: str

    file_name: str