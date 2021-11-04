from typing import Generator

from starlette import status

from app.db.session import SessionLocal


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def responses() -> dict:
    return {
        status.HTTP_404_NOT_FOUND: {
            "description": "Currency Not Found"
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Currency with this code already Exists"
        }
    }
