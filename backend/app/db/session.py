from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from ..core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)
