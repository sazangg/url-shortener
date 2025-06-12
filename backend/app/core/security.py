from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    exp = datetime.now(timezone.utc) + timedelta(
        minutes=settings.JWT_ACCESS_EXP_MINUTES
    )
    payload = {**data, "exp": exp}
    return jwt.encode(
        payload, settings.JWT_SECRET, algorithm=settings.JWT_ENCODE_ALGORITHM
    )


def create_refresh_token(data: dict) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_EXP_DAYS)
    payload = {**data, "exp": exp, "type": "refresh"}
    return jwt.encode(
        payload, settings.JWT_SECRET, algorithm=settings.JWT_ENCODE_ALGORITHM
    )
