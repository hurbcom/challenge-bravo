from typing import Dict, Optional, List
from os import getenv

from requests import get
from requests.exceptions import (
    ConnectTimeout,
    ConnectionError,
    ChunkedEncodingError,
    ReadTimeout,
)


class CurrencyPairIntegration:
    @staticmethod
    def get_currency_pair(
        from_currencies: List[str], to_currency: str
    ) -> Optional[Dict]:
        currencies = ""
        for fc in from_currencies:
            currencies += f"{fc}-{to_currency},"
        currencies = currencies[:-1]

        api_url = f'{getenv("CURRENCY_CONVERSION_API_URL")}/all/{currencies}'
        try:
            return get(api_url).json()
        except (ConnectTimeout, ConnectionError, ChunkedEncodingError, ReadTimeout):
            return None
