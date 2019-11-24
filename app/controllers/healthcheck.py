from controllers import make_response
from flask_restful import Resource
from http import HTTPStatus
from services.coin_cap import CoinCapService
from services.exchange_rates import ExchangeRatesService
from datetime import datetime


class Healthcheck(Resource):
    def __init__(self):
        self._crypto_service = CoinCapService()
        self._service = ExchangeRatesService()

    def get(self):
        services = [
            ("CoinCapApi", self._crypto_service._request_to_api),
            ("ExchangeRatesApi", self._service._request_to_exchange_api)
        ]
        response = list()

        for name, method in services:
            try:
                start = datetime.utcnow()
                method()
                success = True
            except Exception:
                success = False
            finally:
                response.append({
                    "service": name,
                    "success": success,
                    "timestamp": str((datetime.utcnow() - start))
                })
                print(f"{datetime.utcnow() - start}")

        if False in [r["success"] for r in response]:
            return make_response(False,
                                 HTTPStatus.SERVICE_UNAVAILABLE,
                                 response,
                                 ["Any dependencies has fail."])
        else:
            return make_response(True,
                                 HTTPStatus.OK,
                                 response)
