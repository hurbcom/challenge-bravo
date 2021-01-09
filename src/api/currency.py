from flask import request
from common import app

from middleware import validate_request, build_response
from validation import AddCurrencySchema
from service import CurrencyService

PREFIX = "/api/currency"


class CurrencyApi:
    currency_service = CurrencyService()

    def __init__(self):
        self.trigger_endpoints()

    def trigger_endpoints(self):
        @app.route(f"{PREFIX}/add", methods=["POST"])
        @validate_request(validation_schema=AddCurrencySchema)
        def add_currency():
            data = request.json

            new_data = {
                "name": data["name"],
                "iso_code": data["isoCode"]
            }
            app.logger.info(f'Adding currency of iso code {new_data["iso_code"]}')

            currency = self.currency_service.add(new_data)
            return build_response(currency)


CurrencyApi()
