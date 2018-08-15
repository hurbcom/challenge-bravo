import urllib2
import json
from urllib import urlopen
from flask import Flask


# definindo app
app = Flask(__name__)


# api para conversão de todos os valores exceto ETH.
URL = 'https://api.fixer.io/latest?base=USDaccess_key=4625b9091a55dbc051366ad4c57abe77'
# api para conversão valor: ETH
URL_BTC = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=ETH'
# api de conversão yahoo
YAHOO_CURRENCY_CONVERTER = 'http://finance.yahoo.com/connection/currency-converter-cache?date='
# recebe as 2 apis: valores gerais + ETH
rates = [URL_BTC][URL]
# arquivo com dados das apis.
Data = 'static/rates.json'


# função requisita urls
def _get_data(url):
    request = urllib2.Request(url, None)
    try:
        response = urllib2.urlopen(request)
    except urllib2.URLError:
        return None
    result = response.read()
    return result


# função define critérios para conversão.
def convert(from_curr, to_curr='USD', amount=0, date=None):

    if from_curr.lower() == to_curr.lower():
            return amount


    if not date:
        data = _get_data(rates.format(from_curr=from_curr, to_curr=to_curr))

        if data:
            exchange = data.split(',')
            try:
                converted_amount = u'{0:.3f}'.format(round(float(exchange[1]) * amount, 3))
                return float(converted_amount)
            except(IndexError, ValueError):
                pass
            return 0
    else:
        string_cur = ('[' + "".join(urlopen(YAHOO_CURRENCY_CONVERTER + date).readlines()[8:-5]).replace("\n", "") + ']')
        currencies = json.loads(string_cur)


        if currencies:
            try:
                from_curr_rate = 1
                to_curr_rate = 0
                if from_curr.upper() != 'USD':
                    for cur in currencies:
                        if cur['resource']['fields']['symbol'] == from_curr.upper() + '=X':
                            rate = cur['resource']['fields']
                            from_curr_rate = float(rate['price'])
                            break


                for cur in currencies:
                    if cur['resource']['fields']['symbol'] == to_curr.upper() + '=X':
                        rate = cur['resource']['fields']
                        to_curr_rate = float(rate['price'])
                        break


                return (to_curr_rate/from_curr_rate)*amount

            except Exception as exc:
                print(exc)
                pass
        return 0