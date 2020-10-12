from flask_restful import Resource, fields, marshal_with, request
from main.service.sources import Sources
from main.model.rate import Rate
from flask_restful import reqparse

class Currencies(Resource):
    """
    Management of available currencies
    """

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('currency', type=str, required=True, help="currency cannot be blank!")
        args = parser.parse_args()

        active_currency = Sources().get_rates([args.get('currency')]);

        if active_currency[args.get('currency')]:
            currency = active_currency[args.get('currency')]
            output = Rate().load(data=currency)
            return output, 200
        else:
            raise Exception('Currency not found', 404)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('currency', type=str, required=True, help="currency cannot be blank!")
        args = parser.parse_args()

        active_currency = Sources().get_rates([args.get('currency')]);

        if active_currency[args.get('currency')]:
            currency = active_currency[args.get('currency')]
            return Rate().load(data=currency), 201
        else:
            new_currency = Sources().add_rates([args.get('currency')]);
            if new_currency[args.get('currency')]:
                # return new_currency[args.get('currency')], 201
                currency = new_currency[args.get('currency')]
                return Rate().load(data=currency), 201
            else:
                raise Exception('Unknow error, please try again')

    def delete(self,currency):
        active_currency = Sources().get_rates([currency]);

        if active_currency[currency]:
            deleteds = Sources().delete_rates([currency]);
            return deleteds, 204
        else:
            raise Exception('Currency not found', 404)