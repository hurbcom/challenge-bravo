from flask_restful import Resource, fields, marshal_with, request, marshal, reqparse
from main.common.database import DBClient
from main.repository.exchange import ExchangeRate as ExchangeRepository, ExchangeSource as ExchangeSourceRepository
from main.repository.currency import Currency
from main.service.exchangerate import Exchangerate
from datetime import datetime, timedelta
import time


class Exchanges(Resource):
    """
    Exchange calculation response control class
    """

    get_currency_fields = {
        'from': {'currency':fields.String(default='BRL'), 'value':fields.Float},
        'to': {'currency':fields.String, 'value':fields.Float},
    }

    # @marshal_with(get_currency_fields)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('from', type=str, required=True, help="from cannot be blank!")
        parser.add_argument('to', type=str, required=True, help="from cannot be blank!")
        parser.add_argument('amount', type=float, required=True, help="from cannot be blank!")
        args = parser.parse_args()

        timestamp_minus_24_hours = int(time.time()) - 60 * 60 * 24

        exchanges_source = ExchangeSourceRepository().find(
            query={"time_last_updated": {'$gt': timestamp_minus_24_hours}})

        if exchanges_source.count(True):
            exchanges_source = ExchangeSourceRepository().hydrate_rates(exchanges_source[0])
        else:
            exchanges_source = Exchangerate().dump_rates_to_local_database()

        if args.get('from') not in exchanges_source['rates']:
            raise Exception(args.get('from') + ' is not a known currency')

        if args.get('to') not in exchanges_source['rates']:
            raise Exception(args.get('to') + ' is not a known currency')

        is_allowed_from = Currency.find({'currency':args.get('from')})
        if len(is_allowed_from) < 1:
            raise Exception(args.get('from') + ' is not an allowed currency, what about add it?')

        is_allowed_to = Currency.find({'currency':args.get('to')})
        if len(is_allowed_to) < 1:
            raise Exception(args.get('to') + ' is not an allowed currency, what about add it?')

        rate_from = exchanges_source['rates'][args.get('from')]
        rate_to = exchanges_source['rates'][args.get('to')]

        output = {
            'from': {
                'currency':args.get('from'),
                'value':args.get('amount')},
            'to': {
                'currency':args.get('to'),
                'value':round(float(args.get('amount'))*(rate_to/rate_from),2)},
        }

        return output, 200
