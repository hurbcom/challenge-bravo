from flask import Flask, request, make_response, jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError
import json
from requests import Session
import requests
import os
from models.currency import Currency

default_money = ['USD', 'BRL', 'EUR']
default_criptocurrency = ['BTC', 'ETH']


headers = {'Accepts': 'application/json'}

class CurrencyController(object):

    def create(self, code, in_usd):
        try:
            currency = Currency(code=code, in_usd=in_usd)
            currency.save()
            return make_response(jsonify({"message": "Currency created successfully"}), 200)
        except Exception as e:
            return make_response(jsonify({"err": "Could not create a new currency!: "+str(e)}), 500)

    def delete(self, code):
        try:
            curr = Currency.query.filter_by(code=code).first()
            if curr:
                return make_response(jsonify(Currency.query.delete(curr)), 200)
            else:
               return make_response(jsonify({"err": "Currency not found!"}), 404)
        except Exception as e:
            return make_response(jsonify({"err": "Could not delete currencies list!: "+str(e)}), 500)

    def get(self, code):
        try:
            return make_response(jsonify(Currency.query.filter_by(code=code).first()), 200)
        except Exception as e:
            return make_response(jsonify({"err": "Could not get currencies list!: "+str(e)}), 500)

    def getAll(self):
        try:
            return make_response(jsonify(Currency.query.all()), 200)
        except Exception as e:
            return make_response(jsonify({"err": "Could not get currencies list!: "+str(e)}), 500)



    def converter(self, source, destiny, amount):
        session = Session()
        session.headers.update(headers)
        try:

            if (source in default_money and destiny in default_money):
                # getting converted values from an existing service. Life don't need to be hard ;) - Rafael Sampaio
                # The Frankfurter API tracks foreign exchange references rates published by the European Central Bank.
                # The data refreshes around 16:00 CET every working day.
                url = os.getenv('FRANK_FURTER_SERVICE')+f'/latest?amount={amount}&from={source}&to={destiny}'
                with requests.request('get', url=url, stream=True) as response:
                    data = json.loads(response.text)
                    result =  next(iter(data['rates'].values()))
                    return make_response(jsonify({source: amount, destiny: float("{:.2f}".format(result))}), 200)

            elif( (source in default_money or source in default_criptocurrency) and (destiny in default_money or destiny in default_criptocurrency)):

                if(source == 'BRL' and destiny == 'BTC'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount / float(data[34]['rate']))}), 200)

                elif(source == 'BRL' and destiny == 'ETH'):
                    eth_as_btc = None
                    brl_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eth_as_btc = float(data[13]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        brl_as_bct = float(data[34]['rate'])

                    result = (eth_as_btc / brl_as_bct) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                elif(source == 'USD' and destiny == 'BTC'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount / float(data[2]['rate']))}), 200)

                elif(source == 'USD' and destiny == 'ETH'):
                    eth_as_btc = None
                    usd_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eth_as_btc = float(data[13]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        usd_as_bct = float(data[2]['rate'])

                    result = (eth_as_btc / usd_as_bct) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                elif(source == 'EUR' and destiny == 'BTC'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount / float(data[3]['rate']))}), 200)

                elif(source == 'EUR' and destiny == 'ETH'):
                    eth_as_btc = None
                    eur_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eth_as_btc = float(data[13]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eur_as_bct = float(data[3]['rate'])

                    result = (eth_as_btc / eur_as_bct) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                elif(source == 'ETH' and destiny == 'BRL'):
                    eth_as_btc = None
                    brl_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eth_as_btc = float(data[13]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        brl_as_bct = float(data[34]['rate'])

                    result = (brl_as_bct / eth_as_btc) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                elif(source == 'ETH' and destiny == 'BTC'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount / float(data[13]['rate']))}), 200)

                elif(source == 'ETH' and destiny == 'EUR'):
                    eth_as_btc = None
                    eur_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eth_as_btc = float(data[13]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eur_as_bct = float(data[3]['rate'])

                    result = (eur_as_bct / eth_as_btc) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                elif(source == 'ETH' and destiny == 'USD'):
                    eth_as_btc = None
                    usd_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        eth_as_btc = float(data[13]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        usd_as_bct = float(data[2]['rate'])

                    result = (usd_as_bct / eth_as_btc) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                elif(source == 'BTC' and destiny == 'BRL'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount * float(data[34]['rate']))}), 200)

                elif(source == 'BTC' and destiny == 'EUR'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount * float(data[3]['rate']))}), 200)

                elif(source == 'BTC' and destiny == 'ETH'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount * float(data[13]['rate']))}), 200)

                elif(source == 'BTC' and destiny == 'USD'):
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        return make_response(jsonify({source: amount, destiny: (amount * float(data[2]['rate']))}), 200)
            else:
                print('aqui')
                if source == 'BRL':
                    btc = None
                    usd_as_bct = None
                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        btc = float(data[1]['rate'])

                    with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                        data = json.loads(response.text)
                        usd_as_bct = float(data[2]['rate'])

                    result = ( btc/ usd_as_bct) * amount
                    return make_response(jsonify({source: amount, destiny: result}), 200)

                    # destiny_curr = Currency.query.filter_by(code=destiny).first()
                    # if(destiny_curr):
                    #     url = os.getenv('FRANK_FURTER_SERVICE')+f'/latest?amount=1&from=BRL&to=USD'
                    #     with requests.request('get', url=url, stream=True) as response:
                    #         data = json.loads(response.text)
                    #         brl_as_usd =  next(iter(data['rates'].values()))
                    #         result = brl_as_usd  * amount

                    #         return make_response(jsonify({source: amount, destiny: float("{:.2f}".format(result))}), 200)
                    # else:
                    #     return make_response(jsonify({"err": f"Currency {destiny} not found!"}), 404)


                elif source == 'BTC':
                    pass

                elif source == 'EUR':
                    pass

                elif source == 'ETH':
                    pass

                elif source == 'USD':
                    pass

                elif destiny == 'BRL':
                    pass

                elif destiny == 'BTC':
                    pass

                elif destiny == 'EUR':
                    pass

                elif destiny == 'ETH':
                    pass

                elif destiny == 'USD':
                    pass
                else:
                    pass



        except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
            return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)
