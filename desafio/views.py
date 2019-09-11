import requests
from flask_restful import Resource, request

objMoedas = {}


class CarregaMoeda(Resource):
    def get(self):
        global objMoedas
        moedas = requests.get("https://economia.awesomeapi.com.br/all").json()
        usd = float(moedas["USD"]["bid"].replace(",", "."))
        eur = float(moedas["EUR"]["bid"].replace(",", "."))
        btc = float(moedas["BTC"]["bid"].replace(".", "").replace(",", "."))
        eth = float(moedas["ETH"]["bid"].replace(".", "").replace(",", "."))
        brl = float(1)
        obj = {"brl": brl, "eur": eur, "usd": usd, "btc": btc, "eth": eth}
        if objMoedas == {}:
            objMoedas = obj
        de = request.args.get('from', 'usd')
        para = request.args.get('to', 'brl')
        amount = float(request.args.get('amount'))
        try:
            objMoedas[de] == {} and objMoedas[para] == {}
            return (objMoedas[de] / objMoedas[para] * amount)
        except:
            return "Moeda não encontrada"


class InserirMoeda(Resource):
    def get(self):
        global objMoedas
        moedas = requests.get("https://economia.awesomeapi.com.br/all").json()
        usd = float(moedas["USD"]["bid"].replace(",", "."))
        eur = float(moedas["EUR"]["bid"].replace(",", "."))
        btc = float(moedas["BTC"]["bid"].replace(".", "").replace(",", "."))
        eth = float(moedas["ETH"]["bid"].replace(".", "").replace(",", "."))
        brl = float(1)
        obj = {"brl": brl, "eur": eur, "usd": usd, "btc": btc, "eth": eth}
        moeda = request.args.get('moeda')
        while objMoedas == {}:
            objMoedas = obj
        for k in objMoedas.keys():
            if moeda in objMoedas.keys():
                return "já existe essa moeda"
            elif moeda not in obj.keys():
                return "não é possível adicionar essa moeda"
            else:
                objMoedas[moeda] = obj[moeda]
                return objMoedas


class ExcluirMoeda(Resource):
    def delete(self):
        global objMoedas
        moedas = requests.get("https://economia.awesomeapi.com.br/all").json()
        usd = float(moedas["USD"]["bid"].replace(",", "."))
        eur = float(moedas["EUR"]["bid"].replace(",", "."))
        btc = float(moedas["BTC"]["bid"].replace(".", "").replace(",", "."))
        eth = float(moedas["ETH"]["bid"].replace(".", "").replace(",", "."))
        brl = float(1)
        obj = {"brl": brl, "eur": eur, "usd": usd, "btc": btc, "eth": eth}
        moeda = request.args.get('moeda')
        while objMoedas == {}:
            objMoedas = obj
        for k in objMoedas.keys():
            if moeda in objMoedas.keys():
                objMoedas.pop(moeda)
                return objMoedas
            else:
                return ('Não é possível excluir a moeda '+ moeda)
