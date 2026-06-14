from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.utils.jwt_handler import verify_token


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    print("TOKEN RECEIVED:", token)

    payload = verify_token(token)

    print("PAYLOAD:", payload)

    email = payload.get("sub")

    print("EMAIL:", email)

    user = db.query(User).filter(
        User.email == email
    ).first()

    print("USER FOUND:", user)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user