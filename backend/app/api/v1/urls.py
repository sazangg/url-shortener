from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import HttpUrl

from ...core.config import settings
from ...db.session import get_session
from ...schemas import UrlCreate, UrlRead
from ...services.url_service import create_url

router = APIRouter(prefix="/urls", tags=["urls"])


@router.post("/", response_model=UrlRead, status_code=status.HTTP_201_CREATED)
async def shorten(payload: UrlCreate, session=Depends(get_session)):
    url = await create_url(
        session=session,
        original_url=str(payload.original_url),
        expires_at=payload.expires_at,
    )

    if url is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create URL.")

    return UrlRead(
        slug=url.slug,
        short_url=HttpUrl(f"{settings.BASE_URL}/{url.slug}"),
        original_url=HttpUrl(url.original_url),
        expires_at=url.expires_at,
        clicks=url.clicks,
    )
