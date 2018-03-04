import redis
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from flask import Flask

pool = redis.ConnectionPool(host='redis', port=6379, db=0)
rd = redis.Redis(connection_pool=pool)


def get_quotation_from_coinapi(base_ex):
    # COINAPI - is free util 100 requests per day - Too slow
    try:
        resp = requests.get('https://rest.coinapi.io/v1/exchangerate/%s?apikey=39B4C86E-1A2F-401F-A8C3-1BCB8CFA0CC1' % base_ex)
        for rate in resp.json()['rates']:
            rd.set('%s%s' % (base_ex, rate['asset_id_quote']),rate['rate'])
    except Exception as e:
        print(dict(error_message=str(e)))


def get_quotation_from_apilayer(base_ex = 'USD'):
    # currencylayer - is free until 1k total requests and only for USD base
    try:
        resp = requests.get('http://www.apilayer.net/api/live?access_key=9a29405877af2d37a0c949d8aa0583fc&format=1&source=%s' % base_ex)
        for quote in resp.json()["quotes"]:
            rd.set(quote, resp.json()["quotes"][quote])
    except Exception as e:
        print(dict(error_message=str(e)))

def get_quotation_from_openexchange(base_ex = 'USD'):
    # openexchange - is free until 1k per month
    try:
        resp = requests.get('https://openexchangerates.org/api/latest.json?app_id=f2e995cf853e4945b208b96a65d217d7&base=%s' % base_ex)
        for quote in resp.json()["rates"]:
            rd.set('%s%s' % (base_ex, quote), resp.json()["rates"][quote])
    except Exception as e:
        print(dict(error_message=str(e))) 

def get_quotation_from_coinmarketcap(base_ex):
    # coinmarketcap - is free and unlimited
    try:
        resp = requests.get('https://api.coinmarketcap.com/v1/ticker/?convert=%s' % base_ex)
        for quote in resp.json():
            rd.set('%s%s' % (base_ex, quote['symbol']), quote['price_%s' % base_ex.lower()])
    except Exception as e:
        print(dict(error_message=str(e)))

def get_quotation_from_fixer(base_ex):
    # fixer - is free and unlimited
    try:
        resp = requests.get('https://api.fixer.io/latest?base=%s' % base_ex)
        for quote in resp.json()["rates"]:
            rd.set('%s%s' % (base_ex, quote), resp.json()["rates"][quote])
    except Exception as e:
        print(dict(error_message=str(e)))


def get_all():
    get_quotation_from_coinmarketcap('EUR')
    get_quotation_from_coinmarketcap('GBP')
    get_quotation_from_coinmarketcap('BRL')
    get_quotation_from_coinmarketcap('USD')
    get_quotation_from_coinmarketcap('BTC')
    get_quotation_from_coinmarketcap('ETH')
    get_quotation_from_fixer('EUR')
    get_quotation_from_fixer('GBP')
    get_quotation_from_fixer('BRL')
    get_quotation_from_fixer('USD')
    # get_quotation_from_openexchange()
    # get_quotation_from_apilayer()
    # get_quotation_from_coinapi('BTC')
    # get_quotation_from_coinapi('ETH')
    # get_quotation_from_coinapi('BRL')
    # get_quotation_from_coinapi('GBP')
    # get_quotation_from_coinapi('EUR')

print('GET rates on frist time')
get_all()

app = Flask(__name__)
"""
Create a schedule for update rates every 30 minutes
"""
scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(
    func=get_all,
    trigger=IntervalTrigger(minutes=30),
    id='collect_job',
    name='Get exchange rates every 30 minutes',
    replace_existing=True)

if __name__ == '__main__':
    app.run()
