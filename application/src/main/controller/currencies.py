from flask_restful import Resource, fields, marshal_with, request
from main.common.database import DBClient
# from main.model.currency import Currency as CurrencyModel
from main.repository.currency import Currency as CurrencyRepository
from flask_restful import reqparse

class Currencies(Resource):

    insert_currency_fields = {
        'currency': fields.String
    }

    # def get(self):
    #
    #     mongodb = DBClient.conn()
    #
    #     mongo_currencies_collection = mongodb["currencies"]
    #
    #     myquery = {}
    #
    #     mydoc = mongo_currencies_collection.find(myquery)
    #
    #     output = []
    #
    #     for doc in mydoc:
    #         output = MySchema().load(doc)
    #
    #     return output

    @marshal_with(insert_currency_fields)
    def get(self):
        currency = CurrencyRepository.find({"currency": request.args.get('currency')})

        if len(currency):
            currency = currency[0]
            code = 200
        else:
            currency = None
            code = 404

        return currency, code

    @marshal_with(insert_currency_fields)
    def post(self):

        # raise Exception(kwargs)
        parser = reqparse.RequestParser()
        parser.add_argument('currency', type=str, required=True, help="currency cannot be blank!")
        args = parser.parse_args()

        active_currency = CurrencyRepository.find({"currency": args.get('currency')})

        if active_currency:
            return active_currency[0], 423

        data = {"name": args.get('currency'),"currency": args.get('currency')}

        object = CurrencyRepository.create(data)

        return object, 201

    @marshal_with(insert_currency_fields)
    def delete(self, currency):

        active_currency = CurrencyRepository.find({"currency": currency})

        if len(active_currency) < 1:
            return None, 404

        return None, 204
