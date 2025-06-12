from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..db.session import async_session
from ..models import User


async def get_session():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

strict_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login", auto_error=True)
lenient_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login", auto_error=False)

credentials_exc = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def _get_user(session: AsyncSession, user_id: UUID) -> User | None:
    return await session.get(User, user_id)


async def get_current_user(
    token: str = Depends(strict_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    
    user_id: Optional[str] = None

    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ENCODE_ALGORITHM]
        )
        user_id = payload.get("sub")
        user_uuid = UUID(user_id)
    except (JWTError, ValueError, TypeError):
        raise credentials_exc

    user = await _get_user(session, user_uuid)
    if user is None:
        raise credentials_exc
    return user


async def get_current_user_optional(
    token: str | None = Depends(lenient_scheme),
    session: AsyncSession = Depends(get_session),
) -> User | None:
    if token is None:
        return None
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ENCODE_ALGORITHM]
        )
        user_id = payload.get("sub")
        user_uuid = UUID(user_id)
    except (JWTError, ValueError, TypeError):
        return None

    return await _get_user(session, user_uuid)
