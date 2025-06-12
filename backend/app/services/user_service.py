from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from ..core.config import settings
from ..db.session import get_session
from ..models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

credentials_exc = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)
) -> User:
    user_id: Optional[str] = None

    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ENCODE_ALGORITHM]
        )
        if payload:
            user_id = payload.get("sub")
    except JWTError:
        raise credentials_exc

    if user_id is None:
        raise credentials_exc

    user = await session.get(User, UUID(user_id))

    if user is None:
        raise credentials_exc

    return user


async def create_user(session: AsyncSession, email: str, hashed_password: str):
    user = User(email=email, hashed_password=hashed_password)
    session.add(user)
    try:
        await session.flush()
    except IntegrityError as e:
        await session.rollback()
        raise e
    return user


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
