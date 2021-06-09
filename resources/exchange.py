import requests as requests
from flask_restful import Resource, reqparse

from models.exchange import ExchangeModel


class Change(Resource):
    # Realiza o calculo para a compŕa de determinada moeda
    parameters = reqparse.RequestParser()

    parameters.add_argument('to', type=str, required=True, help="Informe a moeda que será convertida")
    parameters.add_argument('frm', type=str, required=True, help="Informe a moeda para conversão")
    parameters.add_argument('amount', type=str, required=True, help="Informe o valor total")

    def get(self):
        str_url = Change.parameters.parse_args()

        frm = str_url.frm
        to = str_url.to
        base = frm.upper() + "-" + to.upper()
        base_convert = to.upper() + "-" + frm.upper()

        currency = ExchangeModel.find_currency_by_name(base)
        if currency:

            row = currency.json()

            if row['value'] == 0:
                now = requests.get('http://economia.awesomeapi.com.br/json/last/' + base_convert)
                query = now.json()
                rate = query
                amount = float(str_url.amount)
                change = round((amount / float(rate[next(iter(rate))]['high'])), 6)
            else:
                amount = float(str_url.amount)
                change = round((amount * row['value']), 2)

            conversion = {'conversion': base, 'amount': float(str_url.amount), 'converted': change}
            return conversion, 200
        else:
            return {'message': 'Conversion {} not found'.format(base)}, 404


class Exchanges(Resource):
    # Carrega todas as moedas de troca cadastradas
    def get(self):
        return {'exchanges': [currency.json() for currency in ExchangeModel.query.all()]}


class Exchange(Resource):
    # Cadastra moedas de troca
    def post(self):
        arguments = reqparse.RequestParser()
        arguments.add_argument('frm', type=str, required=True, help="The field Frm is required")
        arguments.add_argument('to', type=str, required=True, help="The field To is required")
        arguments.add_argument('value', type=str, required=False)
        data = arguments.parse_args()

        if data.value == '':
            data.value = 0

        name = data.frm + "-" + data.to

        if ExchangeModel.find_currency_by_name(name):
            return {"message": "The conversion '{}' already exists on database".format(name)}, 400

        exchange = ExchangeModel(name, data.value)
        try:
            exchange.save_exchange()
        except:
            return {'message': 'There was an error trying to register'}, 500
        return exchange.json(), 201

    # Deleta moedas de troca
    def delete(self):
        arguments = reqparse.RequestParser()
        arguments.add_argument('id', type=int, required=True, help="The ID currency is required")
        data = arguments.parse_args()

        currency = ExchangeModel.find_currency_by_id(data.id)
        if currency:
            try:
                currency.delete_exchange()
                return {'message': 'Currency deleted'}, 200
            except:
                return {'message': 'There was an error trying to delete'}, 500
        return {'message': 'Currency not found {}'.format(data.id)}, 404
