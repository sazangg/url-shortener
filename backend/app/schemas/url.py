from datetime import datetime
from pydantic import BaseModel, HttpUrl

class UrlCreate(BaseModel):
    original_url: HttpUrl
    expires_at: datetime | None = None

class UrlRead(BaseModel):
    slug: str
    short_url: HttpUrl
    original_url: HttpUrl
    expires_at: datetime | None = None
    clicks: int

