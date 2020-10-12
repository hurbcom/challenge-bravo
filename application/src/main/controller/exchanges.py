from flask_restful import Resource, fields, marshal_with, request, marshal, reqparse

from main.service.sources import Sources
from main.model.rate import Rate as RateModel

class Exchanges(Resource):
    """
    Exchange calculation response control class
    """

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('from', type=str, required=True, help="from cannot be blank!")
        parser.add_argument('to', type=str, required=True, help="from cannot be blank!")
        parser.add_argument('amount', type=float, required=True, help="from cannot be blank!")
        args = parser.parse_args()

        rates = Sources().get_rates(currencies=[args.get('from'),args.get('to')])

        if rates[args.get('from')] is None:
            raise Exception(args.get('from') + ' not avaliable')

        if rates[args.get('to')] is None:
            raise Exception(args.get('to') + ' not avaliable')

        from_rate = float(rates[args.get('from')]['rate'])
        to_rate = float(rates[args.get('to')]['rate'])
        rate = from_rate * to_rate if 1/from_rate > 1/to_rate else (1/to_rate) / from_rate

        value = rate * float(args.get('amount'))

        output = {
            'from': {'currency':args.get('from'), 'value':args.get('amount')},
            'to': { 'currency':args.get('to'), 'value':value},
            'rates': {rate:{'rate':rates[rate]['rate']} for rate in rates}
        }

        return output, 200