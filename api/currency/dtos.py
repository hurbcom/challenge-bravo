from dataclasses import dataclass


@dataclass
class CalculateCurrencyExchangeDto:
    currency_from: str
    currency_to: str
    exchange_rate: float
    amount: float
    exchange_value: float

    def asdict(self):
        return {
            "currency_from": self.currency_from, "currency_to": self.currency_to,
            "exchange_rate": self.exchange_rate, "amount": self.amount,
            "exchange_value": self.exchange_value
        }

    # def __init__(
    #     self, currency_from: str, currency_to: str, exchange_rate: float, amount: float, exchange_value: float
    # ):
    #     self.currency_from = currency_from
    #     self.currency_to = currency_to
    #     self.exchange_rate = exchange_rate
    #     self.amount = amount
    #     self.exchange_value = exchange_value
