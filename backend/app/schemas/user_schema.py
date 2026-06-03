from pydantic import BaseModel
from pydantic import EmailStr





class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    role: str | None = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    org_name: str
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    