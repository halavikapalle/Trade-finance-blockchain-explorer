from pydantic import BaseModel

class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    role: str | None = None