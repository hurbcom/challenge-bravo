import json, re, datetime
from flask_restful import Resource
from flask import request
from exchange_rates import usd_rates

class Convert(Resource):

    #GET da api que retorna a moeda convertida
    def get(self):
        coins_regex = "(\AUSD\Z)|(\ABRL\Z)|(\AEUR\Z)|(\ABTC\Z)|(\AETH\Z)"
        base = request.args.get('base', str)
        target = request.args.get('target', str)
        value = float(request.args.get('value', float))
        try:
            if base is None or target is None:   
                return json.dumps({'erro':'Consulta Invalida.'}), 400
            if base is None or target is None:   
                return json.dumps({'erro':'Consulta Invalida.'}), 400
            if not re.match(coins_regex, base) or not re.match(coins_regex, target):
                return json.dumps({'erro':'Moedas nao suportadas'}), 400
            if value == 0 or value is None:
                value = 1

            exchangePrice = self.__get_exchange(base, target)
            data = { "Valor Total Convertido": exchangePrice * value, "Valor de Cambio": exchangePrice, "Data": str(datetime.datetime.today()) }

            return json.dumps(data)

        except:
            return json.dumps({"erro":"Falha de servidor, tente novamente"}), 400
    
    # Reliza a conversão
    def __get_exchange(self, base, target):
        return (1 / usd_rates[base]) / (1 / usd_rates[target])


