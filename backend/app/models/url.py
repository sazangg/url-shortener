from datetime import datetime
from uuid import uuid4, UUID
from sqlalchemy import func, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from ..db.base import Base

class Url(Base):
    __tablename__ = "urls"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    original_url: Mapped[str] = mapped_column(nullable=False, type_=Text)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(nullable=True)
    clicks: Mapped[int] = mapped_column(default=0, server_default=text('0'), nullable=False)
