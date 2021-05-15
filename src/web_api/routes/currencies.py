from flask_restful import Resource, reqparse
from flasgger import swag_from
from src.support.functions import Functions


class CurrenciesConverter(Resource):
    def __init__(self, huby):
        self.huby = huby
        self.parser = reqparse.RequestParser()

        # Add the request params (or body arguments)
        self.parser.add_argument("platform")
        self.parser.add_argument("from", required=True)
        self.parser.add_argument("to", required=True)
        self.parser.add_argument("amount", required=True)

    @swag_from("../../swagger/models/currencies/currencies-converter.yml", endpoint="curriencies/converter")
    def get(self):
        body = self.parser.parse_args()
        if not body["platform"]:
            body["platform"] = self.huby.config.HUBY_PLATFORM_DEFAULT

        fields_to_validate = list(self.parser.parse_args().keys())
        values_to_validation = {
            "platform": self.huby.config.HUBY_PLATFORMS,
        }

        body = Functions.validate_fields_and_values(body, fields_to_validate, values_to_validation)
        if "message" in body:
            return body, 400

        platform = body["platform"]
        my_from = body["from"].replace('"', '')
        to = body["to"].replace('"', '')
        amount = body["amount"].replace('"', '')

        parameters = f"{my_from.upper()}-{to.upper()}"
        response = self.huby.api_conversion.get_value_by_web_id(
            platform=platform,
            web_id=0,
            parameters=parameters,
            system='huby'
        )

        if isinstance(response.json(), list):
            dict_content = response.json()[0]
            amount_converted = float(dict_content["bid"])*float(amount)
            dict_content["price"] = amount_converted
            return dict_content, response.status_code
        elif isinstance(response.json(), dict):
            return response.json(), response.json().get('status', 200)

        return response.json(), 400
