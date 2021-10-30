import requests
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


def init() -> None:
    response = requests.get(f"{settings.API_EXCHANGE_URL}?app_id={settings.API_EXCHANGE_KEY}")
    data = response.json()
    for currency, rate in data["rates"].items():
        logger.info("{}: {}".format(currency, rate))


if __name__ == "__main__":
    init()
