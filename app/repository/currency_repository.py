from models.currency import CurrencyModel

INITIAL_CURRENCIES = [
    ("USD", "US dollars", "Currency of the United States of"
        " America - Wikipedia"),
    ("BRL", "Brazilian real", "Currency of Brazil - Wikipedia"),
    ("EUR", "Euro", "Currency of 19 of the 28 member states"
        " of the European Union - Wikipedia"),
    ("BTC", "Bitcoin", "Decentralized digital "
        "cryptocurrency without a central bank or single "
        "administrator - Wikipedia"),
    ("ETH", "Ethereum", "Ethereum is an open source, public"
        ", blockchain-based distributed computing platform and "
        "operating system featuring smart contract (scripting) "
        "functionality - Wikipedia")
]


class CurrencyRepository:
    _CURRENCIES = list()
    _BACKUP = list()

    def __init__(self):
        if not self._CURRENCIES and not self._BACKUP:
            self._build_initial_currencies()

    def _build_initial_currencies(self):
        for code, name, description in INITIAL_CURRENCIES:
            currency = CurrencyModel(code, name, description)
            self.insert(currency)

    def get_currencies(self):
        return self._CURRENCIES

    def get_currency_by_code(self, currency_code):
        for currency in self._CURRENCIES:
            if currency_code == currency.code:
                return currency

        return None

    def insert(self, currency):
        self._CURRENCIES.append(currency)

    def delete(self, currency_code):
        currency = self.get_currency_by_code(currency_code)
        if not currency:
            return

        self._BACKUP.append(currency)

        index = self._CURRENCIES.index(currency)
        del self._CURRENCIES[index]
