from typing import cast
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.deps import get_current_user_optional, get_session
from ...core.config import settings
from ...models import User
from ...schemas import UrlCreate, UrlRead
from ...services.url_service import create_url

router = APIRouter(prefix="/urls", tags=["urls"])


@router.post("/", response_model=UrlRead, status_code=status.HTTP_201_CREATED)
async def shorten(
    payload: UrlCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User | None = Depends(get_current_user_optional),
):
    url = await create_url(
        session=session,
        original_url=str(payload.original_url),
        user_id=current_user.id if current_user else None,
    )

    if url is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create URL."
        )

    return UrlRead(
        slug=url.slug,
        short_url=cast(HttpUrl, f"{settings.BASE_URL}/{url.slug}"),
        original_url=cast(HttpUrl, url.original_url),
        expires_at=url.expires_at,
        clicks=url.clicks,
    )
