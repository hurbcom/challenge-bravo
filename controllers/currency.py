from flask import Flask, request, make_response, jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError
import json
from requests import Session
import requests
import os

default_money = ['USD', 'BRL', 'EUR']
default_criptocurrency = ['BTC', 'ETH']


headers = {'Accepts': 'application/json'}

class CurrencyController(object):

    def converter(self, source, destiny, amount):

        if (source in default_money and destiny in default_money):
            try:
                session = Session()
                session.headers.update(headers)
                # getting converted values from an existing service. Life don't need to be hard ;) - Rafael Sampaio
                # The Frankfurter API tracks foreign exchange references rates published by the European Central Bank.
                # The data refreshes around 16:00 CET every working day.
                url = os.getenv('FRANK_FURTER_SERVICE')+f'/latest?amount={amount}&from={source}&to={destiny}'
                print(url)

                with requests.request('get', url=url, stream=True) as response:
                    data = json.loads(response.text)
                    result =  next(iter(data['rates'].values()))
                    return make_response(jsonify({source: amount, destiny: float("{:.2f}".format(result))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'BRL' and destiny == 'BTC'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount / float(data[34]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'BRL' and destiny == 'ETH'):
            try:
                session = Session()
                session.headers.update(headers)
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

            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'USD' and destiny == 'BTC'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount / float(data[2]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'USD' and destiny == 'ETH'):
            try:
                session = Session()
                session.headers.update(headers)
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

            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'EUR' and destiny == 'BTC'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount / float(data[3]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'EUR' and destiny == 'ETH'):
            try:
                session = Session()
                session.headers.update(headers)
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

            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'ETH' and destiny == 'BRL'):
            try:
                session = Session()
                session.headers.update(headers)
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

            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'ETH' and destiny == 'BTC'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount / float(data[13]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'ETH' and destiny == 'EUR'):
            try:
                session = Session()
                session.headers.update(headers)
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

            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'ETH' and destiny == 'USD'):
            try:
                session = Session()
                session.headers.update(headers)
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

            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'BTC' and destiny == 'BRL'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount * float(data[34]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'BTC' and destiny == 'EUR'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount * float(data[3]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'BTC' and destiny == 'ETH'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount * float(data[13]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)

        elif(source == 'BTC' and destiny == 'USD'):
            try:
                session = Session()
                session.headers.update(headers)
                with requests.request('get', url=os.getenv('BIT_PAY_SERVICE'), stream=True) as response:
                    data = json.loads(response.text)
                    return make_response(jsonify({source: amount, destiny: (amount * float(data[2]['rate']))}), 200)
            except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
                return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)



