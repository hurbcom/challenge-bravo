from flask_restful import Resource, reqparse
from flasgger import swag_from
from src.support.functions import Functions


class CurrencyConverter(Resource):
    def __init__(self, hurby):
        self.hurby = hurby
        self.parser = reqparse.RequestParser()

        # Add the request params (or body arguments)
        self.parser.add_argument("platform", type=str)
        self.parser.add_argument("from", type=str, required=True)
        self.parser.add_argument("to", type=str, required=True)
        self.parser.add_argument("amount", type=float, required=True)

    @swag_from("../../swagger/models/currency/currency-converter.yml", endpoint="hurby/currency/converter")
    def get(self):
        body = self.parser.parse_args()
        if not body["platform"]:
            body["platform"] = self.hurby.config.HURBY_PLATFORM_DEFAULT

        fields_to_validate = list(self.parser.parse_args().keys())
        values_to_validation = {
            "platform": self.hurby.config.HURBY_PLATFORMS,
        }

        body = Functions.validate_fields_and_values(body, fields_to_validate, values_to_validation)
        if "message" in body:
            return body, 400

        try:
            platform = body["platform"]
            from_ = body["from"].replace('"', '')
            to = body["to"].replace('"', '')
            amount = body["amount"]

            parameters = f"{from_.upper()}-{to.upper()}"
            response = self.hurby.api_conversion.get_value_by_web_id(
                platform=platform,
                web_id=0,
                parameters=parameters,
                system='hurby'
            )
            print(response.json())
            if response.status_code == 200:
                dict_content = response.json()[0]
                amount_converted = Functions.calculate_exchange(from_, to, amount, dict_content["bid"])
                return {
                        'message': {
                            'calculated_exchange': amount_converted
                        }
                    }, response.status_code
            return response.json(), response.json().get('status', response.status_code)
        except Exception as err:
            return {
                    'message': {
                        'error': str(err)
                    }
                }, 500
