from uuid import UUID
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from jose import JWTError, jwt

from ...schemas import TokenRead, UserCreate
from ...api.deps import get_session
from ...services import create_user, get_user_by_email
from ...core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    hash_password,
)
from ...core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

def set_refresh_cookie(response: Response, refresh_token: str):
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="strict",
        secure=False,
        path="/auth/refresh",
        max_age=settings.JWT_REFRESH_EXP_DAYS * 24 * 60 * 60
    )

@router.post("/register", response_model=TokenRead, status_code=status.HTTP_201_CREATED)
async def register_user(data: UserCreate, response: Response, session: AsyncSession = Depends(get_session)):
    try:
        user = await create_user(
            session=session,
            email=data.email,
            hashed_password=hash_password(data.password),
        )
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    set_refresh_cookie(response, refresh_token)

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
async def login_user(
    response: Response,
    data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    user = await get_user_by_email(session=session, email=data.username)

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    set_refresh_cookie(response, refresh_token)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh", response_model=TokenRead)
async def refresh_token(request: Request, response: Response):
    token_cookie = request.cookies.get("refresh_token")

    if not token_cookie:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

    try:
        payload = jwt.decode(token_cookie, settings.JWT_SECRET, algorithms=[settings.JWT_ENCODE_ALGORITHM])
        if payload.get("type") != "refresh":
            raise JWTError
        user_id = UUID(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token = create_access_token({"sub": str(user_id)})
    refresh_token = create_refresh_token({"sub": str(user_id)})

    set_refresh_cookie(response, refresh_token)

    return {"access_token": access_token, "token_type": "bearer"}
