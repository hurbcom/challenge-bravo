from typing import Dict
from schemas import ExchangedCurrencySchema
from models import CustomCurrency
from config.constants import EXTERNAL_CURRENCY_API_URL
from requests import get
from schemas import ExternalExchangeSchema


class CurrencyExchangeService:
    def __init__(self, from_currency: str, to_currency: str, value: float):
        self.from_currency = from_currency
        self.to_currency = to_currency
        self.value = value

    def request_external_exchange(self, from_currency: str, to_currency: str):
        url: str = f"{EXTERNAL_CURRENCY_API_URL}last/"
        request_api = get(
            f"{url}{from_currency.upper()}-{to_currency.upper()}"
        )

        request_api.raise_for_status()

        return request_api.json()

    async def get_ext_currency_data(
        self, from_currency: str, to_currency: str
    ):
        ext_exchanged_data = ExternalExchangeSchema(
            data=self.request_external_exchange(from_currency, to_currency)
        ).data[f"{from_currency}{to_currency}"]

        ext_name: str = ext_exchanged_data.name
        ext_bid: str = ext_exchanged_data.bid

        currency_data: Dict = dict(
            from_currency=from_currency,
            to_currency=to_currency,
            name=ext_name,
            value=ext_bid,
        )

        return ExchangedCurrencySchema(**currency_data)

    async def get_currency_data(self):
        custom_from_currency = await CustomCurrency.get_or_none(
            code=self.from_currency
        )
        custom_to_currency = await CustomCurrency.get_or_none(
            code=self.to_currency
        )

        if custom_from_currency is None and custom_to_currency is None:
            ext_data = await self.get_ext_currency_data(
                self.from_currency, self.to_currency
            )
            return ext_data

        # If local from currency not found
        # Try to exchange to the base currency using the external API
        if custom_from_currency is not None and custom_to_currency is None:
            data = await self.convert_to_base_currency(self.to_currency)

            exchange_result: float = self._exchange(
                from_value=custom_from_currency.value, to_value=data["bid"]
            )

            return self.build_schema(
                self.from_currency,
                self.to_currency,
                f"{custom_from_currency.name}/{self.to_currency} (EXT)",
                bid=exchange_result,
            )

        if custom_from_currency is None and custom_to_currency is not None:
            data = await self.convert_to_base_currency(self.from_currency)

            exchange_result: float = self._exchange(
                from_value=data["bid"],
                to_value=custom_to_currency.value,
            )

            return self.build_schema(
                self.from_currency,
                self.to_currency,
                f"{self.from_currency} (EXT) /{custom_to_currency.name}",
                bid=exchange_result,
            )

    @staticmethod
    def build_schema(
        from_currency: str, to_currency: str, name: str, bid: str
    ):
        currency_data: Dict = dict(
            from_currency=from_currency,
            to_currency=to_currency,
            name=name,
            value=bid,
        )

        return ExchangedCurrencySchema(**currency_data)

    async def convert_to_base_currency(self, from_currency: str):
        to_currency: str = "USD"  # Default currency

        ext_exchanged_base_data = ExternalExchangeSchema(
            data=self.request_external_exchange(from_currency, to_currency)
        ).data[f"{from_currency}{to_currency}"]

        ext_name: str = ext_exchanged_base_data.name
        ext_bid: str = ext_exchanged_base_data.bid

        return dict(name=ext_name, bid=ext_bid)

    @staticmethod
    def _exchange(from_value, to_value):
        return float(from_value) * float(to_value)
