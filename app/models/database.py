from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, pool_size=2500, max_overflow=20)

async_session = sessionmaker(engine, class_=AsyncSession)

Base = declarative_base()


async def get_db():
    db = async_session()
    try:
        yield db
    finally:
        await db.close()
