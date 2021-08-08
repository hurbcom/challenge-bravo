
import sys
import requests
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(
                Singleton, cls
            ).__call__(*args, **kwargs)
        return cls._instances[cls]


class ConsultOpenExchangeRatesAdapter(metaclass=Singleton):
    """
    Classe ConsultOpenExchangeRates responsável por consultar no serviço de API Open Exchange Rates as
    cotações mais recentes disponíveis.

    Documentação:
        https://developers.coinbase.com/api/v2

    Endpoints utilizados:
        https://api.coinbase.com/v2/currencies
        https://api.coinbase.com/v2/exchange-rates/?currency=currency_from
    """

    currency_dict: dict = None
    exchange_rate_dict: dict = None

    def __init__(self):
        if not self.currency_dict:
            self.currency_dict = self.consult_currency_dict()
        if not self.exchange_rate_dict:
            self.exchange_rate_dict = dict()

    def consult_exchange_rate(self, currency_from: str = None, currency_to: str = None):
        """
        Método que consulta a taxa de câmbio em uma API externa, calcula o exchange_value,
        carrega os dados de currency_from em memória para evitar novas consultas,
        retorna um dicionário onde a chave é o ISO_CODE da moeda e o valor é um dict no formato abaixo

        :param currency_from: str
        :param currency_to: str
        :return: float

        Exemplo:
            response_dict = {
                "data": {
                    "currency": "BRL",
                    "rates": {
                        /* ... */
                        "BRL": "1.0",
                        "BSD": "0.1906032593157343",
                        "BTN": "14.1470589917087582897935",
                        /* ... */
                        "GBP": "0.1369145144381968938446",
                        /* ... */
                        "USD": "0.1906032593157343",
                        "BTC": "0.0000047317134397164769127767894938128",
                        "ETH": "0.00006879183582482357796369694366567",
                        "ETH2": "0.00006879183582482357796369694366567",
                        /* ... */
                    }
                }
            }
            return exchange_rate
        """

        if currency_from in self.exchange_rate_dict:
            return float(self.exchange_rate_dict[currency_from]["data"]["rates"][currency_to])

        url = f'https://api.coinbase.com/v2/exchange-rates/?currency={currency_from}'

        try:
            session = requests.Session()
            api_response = session.get(url)
            response = api_response.json()

            self.exchange_rate_dict[currency_from] = response

            exchange_rate = float(self.exchange_rate_dict[currency_from]["data"]["rates"][currency_to])

        except Exception as err:
            logger.log(level=1, msg=str(err))
            raise Exception(f'Erro ao consultar as moedas {currency_from} e {currency_to}. {err}')

        return exchange_rate

    def consult_currency_dict(self):
        """
        Método que pesquisa em uma API externa a lista com todas as moédas disponíveis que
        retorna uma lista de dicionários onde a chave "id" é o ISO_CODE da moeda
        e o "name" é uma string '<Pais_de_Origem> <Nome>'.
        Após uma formatação dos dados, o método retorna um dicionário com as moedas disponíveis na API.
        Exemplo:
            response_dict = {
                "data": [
                    /* ... */
                    {
                        "id": "BRL",
                        "name": "",
                        "min_size": "0.01000000"
                    },
                    /* ... */
                    {
                        "id": "USD",
                        "name": "US Dollar",
                        "min_size": "0.01000000"
                    },
                    /* ... */
                    {
                        "id": "ZWL",
                        "name": "Zimbabwean Dollar",
                        "min_size": "0.01000000"
                    }
                ]
            }
            return {
                /* ... */
                "BRL": {
                    "iso_code": 'BRL',
                    "name": 'Real',
                    "territory": 'Brazilian'
                },
                /* ... */
                "USD": {
                    "iso_code": 'USD',
                    "name": 'Dollar',
                    "territory": 'US'
                },
                /* ... */
            }
        """

        if self.currency_dict:
            return self.currency_dict

        url = 'https://api.coinbase.com/v2/currencies'

        currency_dict = dict()

        session = requests.Session()
        api_response = session.get(url)
        response = api_response.json()

        try:

            for api_currency in response["data"]:

                api_currency_name = api_currency["name"]

                if api_currency["id"] == "EUR":
                    api_currency_name = "European Union Euro"

                if "Ethereum" in api_currency_name or "Bitcoin" in api_currency_name:
                    api_currency_name = api_currency_name.replace(" ", "")

                # Assume que as moedas (a maioria) de 1 só nome são moedas virtuais e coloca a
                # referência ao 'territory' como 'Virtual'
                if len(api_currency["name"].split()) == 1:
                    api_currency_name = f'Virtual {api_currency["name"]}'

                api_name_list = api_currency_name.split()

                currency = {
                    "iso_code": api_currency["id"],
                    "name": api_name_list[-1],
                    "territory": ''.join(api_name_list[:-1]),
                }

                currency_dict[currency["iso_code"]] = currency

        except Exception as err:
            logger.log(level=1, msg=str(err))
            raise Exception(f'Erro ao consultar a lista de moedas. {err}')

        return currency_dict
