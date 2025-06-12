from jose import jwt
from datetime import datetime, timedelta, timezone

from ..core.config import settings

def create_access_token(data: dict) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_EXP_MINUTES)
    payload = {**data, "exp": exp}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ENCODE_ALGORITHM)


def create_refresh_token(data: dict) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_EXP_DAYS)
    payload = {**data, "exp": exp, "type": "refresh"}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ENCODE_ALGORITHM)
