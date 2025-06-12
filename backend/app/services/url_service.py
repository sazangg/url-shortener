import asyncio
import random
from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Url
from ..core.utils import generate_random_slug

MAX_ATTEMPTS = 5


async def create_url(
    *,
    session: AsyncSession,
    original_url: str,
    expires_at: datetime | None,
    user_id: UUID | None =None,
) -> Url | None:
    if expires_at is None and user_id is None:
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    for _ in range(MAX_ATTEMPTS):
        new_url = Url(
            original_url=original_url,
            expires_at=expires_at,
            slug=generate_random_slug(),
            user_id=user_id
        )
        session.add(new_url)
        try:
            await session.flush()
            return new_url
        except IntegrityError:
            await session.rollback()
            session.expunge(new_url)
            await asyncio.sleep(random.uniform(0, 0.05))
    raise RuntimeError(
        "Failed to create URL after multiple attempts due to IntegrityError."
    )
