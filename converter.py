from flask import Flask
from flask_restful import Api, Resource, reqparse
import requests, json

app = Flask(__name__)
api = Api(app)

valid_currencies = ["usd", "eur", "brl", "btc", "eth"]

curr_amount = 5

print("Available currencies: ", end='')

def verify_valid_currencies(to_cur, from_cur):
    to_conf = False
    from_conf = False
    print("to_cur",to_cur)
    print("from_cur",from_cur)
    for item in (valid_currencies):
        print("item", item)
        if(to_cur == item):
            to_conf = True
        if(from_cur == item):
            from_conf = True
    print(to_conf, from_conf)
    if(to_conf and from_conf):
        return True
    else:
        return False
    

def test_json():
    r = requests.get("currencies.json")
    print(r.json())

def teste_json(from_currency, to_currency, amount):
    
    import requests, json

    #getting the json from a site
    r = requests.get('http://www.floatrates.com/daily/usd.json')

    result = r.json()

    if(from_currency == "usd"):
        from_rate = 1
    else :
        from_rate = result[from_currency]["rate"]
    
    if(to_currency == "usd"):
        to_rate = 1
    else :
        to_rate = result[to_currency]["rate"]
    
    print("rate dollar/" + from_currency, from_rate)
    print("rate dollar/" + to_currency , to_rate)

    total = (amount/from_rate)*to_rate

    print("total amount", total)

def teste_crypto(crypto_name):
    import requests

    r = requests.get('https://api.coinmarketcap.com/v1/ticker/'+crypto_name)

    result = r.json()

    print(result[0]['price_usd'])


if __name__ == "__main__" : 

    #function calling
    #teste_json(input_cur, output_cur, amount)
    #teste_crypto("bitcoin")
    test_json()

