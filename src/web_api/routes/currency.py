from flask_restful import Resource, reqparse
from flasgger import swag_from
from src.support.functions import Functions


class Currency(Resource):
    def __init__(self, cache):
        self.cache = cache
        self.parser = reqparse.RequestParser()
        self.cache_key = "currencies"

        # Add the request params (or body arguments) for method POST
        self.parser.add_argument("id", type=str.upper, required=True)
        self.parser.add_argument("name", type=str.upper, required=True)

    @swag_from("../../swagger/models/currency/currency-get.yml",
               endpoint="hurby/currency")
    def get(self):
        content = self.cache.get_cache_value_to_json(key=self.cache_key)
        return content

    @swag_from("../../swagger/models/currency/currency-post.yml",
               endpoint="hurby/currency")
    def post(self):
        body = self.parser.parse_args()
        # Check if currency is true for API. API(true) or USER(fictitious)
        notfictitious = self.cache.check_id_exists_in_cache_value_to_json('currencies_api', body['id'])
        dict_val = [body['name'], 'API'] \
            if notfictitious is True else [body['name'], 'USER']
        content = self.cache.upd_cache_value_to_json_ins(key=self.cache_key,
                                                         dict_id=str(body['id']).upper(),
                                                         dict_val=dict_val)
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
        self.cache_key = "currencies"

    @swag_from("../../swagger/models/currency/currency-id-delete.yml",
               endpoint="hurby/currency/id")
    def delete(self, id):
        content = self.cache.upd_cache_value_to_json_del(key=self.cache_key,
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
        self.cache_key = "currencies"

        # Add the request params (or body arguments)
        self.parser.add_argument("platform", type=str.upper,
                                 default=self.hurby.config.HURBY_PLATFORM_DEFAULT)
        self.parser.add_argument("from", type=str.upper, required=True)
        self.parser.add_argument("to", type=str.upper, required=True)
        self.parser.add_argument("amount", type=float, required=True)

    @swag_from("../../swagger/models/currency/currency-converter.yml",
               endpoint="hurby/currency/converter")
    def get(self):
        body = self.parser.parse_args()
        fields_to_validate = list(self.parser.parse_args().keys())

        # Get the list of available currencies after the user inserts and deletes currencies
        dict_currencies = self.hurby.cache.get_cache_value_to_json(key=self.cache_key)
        list_currencies = [*dict_currencies]
        values_to_validation = {
            "from": list_currencies,
            "to": list_currencies
        }

        # Rule: ...Construa também um endpoint para adicionar e remover moedas suportadas pela API...
        # Independente da moeda ser verídica ou fictícia, ela tem que estar na base de dados
        message_error = "The Currency Id entered is not registered in the database. "
        body = Functions.validate_fields_and_values(body, fields_to_validate,
                                                    values_to_validation,
                                                    message_error)
        if "message" in body:
            return body, 404

        try:
            platform = body["platform"]
            from_ = body["from"]
            to = body["to"]
            amount = body["amount"]

            currency_default = self.hurby.config.HURBY_CURRENCY_BALLAST  # USD
            if dict_currencies.get(to, None) is None:
                return {
                           'success': False,
                           'message': f"Invalid value to field 'to'. " + message_error
                       }, 404

            to = currency_default if dict_currencies[to][1] == 'USER' else to
            body["to"] = to

            if dict_currencies.get(from_, None) is None:
                return {
                           'success': False,
                           'message': f"Invalid value to field 'from'. " + message_error
                       }, 404

            from_ = currency_default if dict_currencies[from_][1] == 'USER' else from_
            body["from"] = from_

            field = ["to", "from"]
            qty_error = 0
            for i in range(0, len(field)):
                values_to_validation = {
                    "platform": self.hurby.config.HURBY_PLATFORMS,
                    field[i]: self.hurby.config.HURBY_CURRENCIES_BASE
                }

                body = Functions.validate_fields_and_values(body, fields_to_validate,
                                                            values_to_validation)
                if "message" in body:
                    qty_error += 1

            if qty_error == 2:
                return {
                           'success': False,
                           'message': "Currencies combination not supported by the API. "
                       }, 400

            parameters = f"{from_}-{to}"
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
