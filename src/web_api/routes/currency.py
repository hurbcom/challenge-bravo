from flask_restful import Resource, reqparse
from flasgger import swag_from
from src.support.functions import Functions

cache_key = "currencies"


class Currency(Resource):
    def __init__(self, cache):
        self.cache = cache
        self.parser = reqparse.RequestParser()

        # Add the request params (or body arguments) for method POST
        self.parser.add_argument("id", type=str, required=True)
        self.parser.add_argument("name", type=str, required=True)

    @swag_from("../../swagger/models/currency/currency-get.yml",
               endpoint="hurby/currency")
    def get(self):
        content = self.cache.get_cache_value_to_json(key=cache_key)
        return content

    @swag_from("../../swagger/models/currency/currency-post.yml",
               endpoint="hurby/currency")
    def post(self):
        body = self.parser.parse_args()
        content = self.cache.upd_cache_value_to_json_ins(key=cache_key,
                                                         dict_id=body['id'],
                                                         dict_val=body['name'])
        if content.get(body['id'], None) is not None:
            return {
                'success': True,
                'message': f"Currency Id: {body['id']} was successfully created. "
            }, 201
        else:
            return {
                'success': False,
                'message': f"Currency Id: {body['id']} had already been created. "
            }, 404


class CurrencyId(Resource):
    def __init__(self, cache):
        self.cache = cache

    @swag_from("../../swagger/models/currency/currency-id-delete.yml",
               endpoint="hurby/currency/id")
    def delete(self, id):
        content = self.cache.upd_cache_value_to_json_del(key=cache_key,
                                                         dict_id=id)
        if content.get(id, None) is None:
            return {
                'success': True,
                'message': f"Currency Id: {id} was successfully deleted. "
            }
        else:
            return {
                'success': False,
                'message': f"Currency Id: {id} has not been deleted. "
            }, 404


class CurrencyConverter(Resource):
    def __init__(self, hurby):
        self.hurby = hurby
        self.parser = reqparse.RequestParser()

        # Add the request params (or body arguments)
        self.parser.add_argument("platform", type=str, default=self.hurby.config.HURBY_PLATFORM_DEFAULT)
        self.parser.add_argument("from", type=str, required=True)
        self.parser.add_argument("to", type=str, required=True)
        self.parser.add_argument("amount", type=float, required=True)

    @swag_from("../../swagger/models/currency/currency-converter.yml",
               endpoint="hurby/currency/converter")
    def get(self):
        body = self.parser.parse_args()

        fields_to_validate = list(self.parser.parse_args().keys())
        values_to_validation = {
            "platform": self.hurby.config.HURBY_PLATFORMS,
            "to": self.hurby.config.HURBY_CURRENCIES_TO
        }

        body = Functions.validate_fields_and_values(body, fields_to_validate,
                                                    values_to_validation)
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
                web_id=1,
                parameters=parameters,
                system='hurby'
            )
            if response.status_code == 200:
                dict_content = response.json()[0]
                amount_converted = \
                    Functions.calculate_exchange(from_, to, amount,
                                                 dict_content["bid"])
                return {
                        'success': True,
                        'data': {'amount_converted': amount_converted}
                    }, response.status_code
            return response.json(), response.json().get('status',
                                                        response.status_code)
        except Exception as err:
            return {
                    'success': False,
                    'message': str(err)
                }, 500
