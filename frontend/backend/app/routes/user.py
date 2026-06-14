from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.middleware.auth_middleware import get_current_user
from app.schemas.user_update_schema import UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_me(
    current_user = Depends(get_current_user)
):
    

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "org_name": current_user.org_name
    }
@router.get("/")
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return users
@router.get("/{user_id}")
def get_user(user_id: int,
             db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user
@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if "name" in data:
        user.name = data["name"]

    if "email" in data:
        user.email = data["email"]

    if "role" in data:
        user.role = data["role"]

    db.commit()

    return {
        "message": "User updated"
    }
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)

    db.commit()

    return {
        "message": "User deleted"
    }
