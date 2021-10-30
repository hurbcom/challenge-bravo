import logging

from db.init_db import init_db
from db.session import SessionLocal
from core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    db = SessionLocal()
    init_db(db, settings.API_EXCHANGE_URL, settings.API_EXCHANGE_KEY)


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
