from flask import Flask, request, make_response, jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError
import json
from requests import Session
import requests
import os
from models.currency import Currency
from google_currency import convert
from project.settings import default_currencies
import re

USD_REFERENCE = 1


class CurrencyController(object):

    def create(self, code, in_usd):
        try:
            if code in default_currencies:
                return make_response(jsonify({"message": "You can't use a default currency code."}), 400)

            if not bool(re.match('^[A-Z]+$', code)):
                return make_response(jsonify({"message": "Currency code must contains only uppercase letters."}), 400)


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

    def getAllCustomCurrenciesCodes(self):
        allCurrenciesCodes = []
        rows = Currency.query.with_entities(Currency.code).all()
        for row in rows:
            allCurrenciesCodes.append(row[0])
        return allCurrenciesCodes


    def converter(self, source, destiny, amount):
        default_response = {
            "converted": True,
            "from": source,
            "to": destiny,
        }
        session = Session()
        session.headers.update({'Accepts': 'application/json'})
        try:
            customCurrenciesCodes = self.getAllCustomCurrenciesCodes()

            if (source in customCurrenciesCodes or source in default_currencies) and (destiny in customCurrenciesCodes or destiny in default_currencies):

                if source in customCurrenciesCodes and destiny in customCurrenciesCodes:
                    """
                        It is not possible to perform the conversion between two fictitious currencies because
                        this use case is not covered by the challenge specification. Please check the challenge
                        description at: https://github.com/hurbcom/challenge-bravo#-desafio-bravo
                    """
                    return make_response(jsonify({"err": "It is not possible to perform the conversion between two fictitious currencies"}), 400)

                if source in customCurrenciesCodes:
                    if destiny == 'USD':
                        customCurrency = Currency.query.filter_by(code=source).first()
                        result = (USD_REFERENCE / customCurrency.in_usd ) * amount
                        default_response.update({'amount': str(result)})
                        return make_response(jsonify(default_response), 200)
                    else:
                        customCurrency = Currency.query.filter_by(code=source).first()
                        destiny_as_usd = convert(destiny, 'USD', USD_REFERENCE)
                        destiny_as_usd = float(json.loads(destiny_as_usd)['amount'])
                        result = USD_REFERENCE / ((customCurrency.in_usd * destiny_as_usd) * amount)
                        default_response.update({'amount': str(result)})
                        return make_response(jsonify(default_response), 200)


                elif destiny in customCurrenciesCodes:
                    if source == 'USD':
                        customCurrency = Currency.query.filter_by(code=destiny).first()
                        result = (customCurrency.in_usd ) * amount
                        default_response.update({'amount': str(result)})
                        return make_response(jsonify(default_response), 200)
                    else:
                        customCurrency = Currency.query.filter_by(code=destiny).first()
                        source_as_usd = convert(source, 'USD', USD_REFERENCE)
                        source_as_usd = float(json.loads(source_as_usd)['amount'])
                        result = (customCurrency.in_usd * source_as_usd) * amount
                        default_response.update({'amount': str(result)})
                        return make_response(jsonify(default_response), 200)

                else:
                    converted = convert(source, destiny, amount)
                    converted = json.loads(converted)
                    return make_response(converted, 200)
            else:
                return make_response(jsonify({"err": "Our API dosen't suport this convertion"}), 404)

        except (ConnectionError, Timeout, TooManyRedirects, ChunkedEncodingError) as e:
            return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(e)}), 500)
