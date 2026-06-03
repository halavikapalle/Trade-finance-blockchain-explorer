from pydantic import BaseModel


class LedgerCreate(BaseModel):

    document_id: int
    action: str
    event_details: str | None = None