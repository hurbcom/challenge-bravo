from models.currency import CurrencyModel

# TODO: Melhorar descriptions; Precisa da fonte?
INITIAL_CURRENCIES = [
    ("USD", "US dollars", "Wikipedia: Currency of the United States of"
        " America"),
    ("BRL", "Brazilian real", "Wikipedia: Currency of Brazil"),
    ("EUR", "Euro", "Wikipedia: Currency of 19 of the 28 member states"
        " of the European Union"),
    ("BTC", "Bitcoin", "Wikipedia: Decentralized digital "
        "cryptocurrency without a central bank or single "
        "administrator"),
    ("ETH", "Ethereum", "Wikipedia: Ethereum is an open source, public"
        ", blockchain-based distributed computing platform and "
        "operating system featuring smart contract (scripting) "
        "functionality")
]


class CurrencyRepository:
    _CURRENCIES = list()

    def __init__(self):
        if not self._CURRENCIES:
            self._build_initial_currencies()

    def _build_initial_currencies(self):
        for code, name, description in INITIAL_CURRENCIES:
            # TODO: Incluir ID autogerado para os objetos
            self.insert(CurrencyModel(code, name, description))

    def get_currencies(self):
        return self._CURRENCIES

    def insert(self, currency):
        # TODO: Verificar se já não existe esta moeda no repo
        # TODO: Validar se o currency code existe na api exchange
        self._CURRENCIES.append(currency)
