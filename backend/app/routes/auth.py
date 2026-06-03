from fastapi import HTTPException

from app.schemas.user_schema import UserLogin

from app.utils.security import verify_password

from app.utils.jwt_handler import create_access_token
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.schemas.user_schema import UserCreate

from app.utils.security import hash_password
from fastapi.security import OAuth2PasswordRequestForm
from app.services.audit_service import create_audit_log
from fastapi import HTTPException
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        org_name=user.org_name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ✅ audit log MUST be here (before return)
    create_audit_log(
        db,
        user_id=new_user.id,
        action="REGISTER",
        details="User registered"
    )

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }

@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
    ):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    valid_password = verify_password(form_data.password, db_user.password)

    if not valid_password:
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    # ✅ audit log for login
    create_audit_log(
        db,
        user_id=db_user.id,
        action="LOGIN",
        details="User logged in"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role
    }