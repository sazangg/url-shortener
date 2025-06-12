from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select, text, update
from sqlalchemy.ext.asyncio import AsyncSession

from .api.v1 import router_api_v1
from .db.session import engine
from .models import Url
from .api.deps import get_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))

    yield

    await engine.dispose()


app = FastAPI(lifespan=lifespan, title="URL Shortener MVP")
app.include_router(router_api_v1)


@app.get("/{slug}")
async def redirect(slug: str, session: AsyncSession = Depends(get_session)):
    stmt = select(Url).where(Url.slug == slug)
    result = await session.execute(stmt)
    url_obj: Url | None = result.scalar_one_or_none()

    if url_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="URL not found"
        )

    if url_obj.expires_at is not None and url_obj.expires_at < datetime.now(
        timezone.utc
    ):
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="URL has expired")

    await session.execute(
        update(Url).where(Url.slug == slug).values(clicks=Url.clicks + 1)
    )

    return RedirectResponse(url_obj.original_url)
