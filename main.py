import requests
from flask import Flask, render_template, request, make_response, url_for, jsonify
from pymongo.errors import WriteError
from schema import SchemaError
from challenge_bravo.configuration.configurations import get_container
from challenge_bravo.domain.currency import Currency
from challenge_bravo.exceptions.conversion_exceptions import MissingParameterError, UnableToFindCurrencyError
from challenge_bravo.exceptions.mongo_exceptions import NoMatchedCurrency

app = Flask(__name__)


@app.route("/currencies", methods=['GET'])
def get_currencies():
    mongo = get_container().get('mongodb')
    result = list(Currency(mongo).get_items())
    return make_response(jsonify(result), 200)


@app.route("/currencies/<currency_id>", methods=['PUT'])
def update_currencies(currency_id):
    mongo = get_container().get('mongodb')
    body = request.json
    try:
        currency = Currency(mongo, **body).validate()
        currency.update_object(currency_id)
        return make_response(jsonify({'message': 'Object Updated'}), 200)
    except NoMatchedCurrency as e:
        return make_response(jsonify({'message': str(e)}), 200)
    except WriteError as e:
        return make_response(jsonify({'message': str(e)}), 400)
    except SchemaError as e:
        return make_response(jsonify({'message': str(e)}), 400)


@app.route("/currencies", methods=['POST'])
def add_currency():
    mongo = get_container().get('mongodb')
    try:
        currency = Currency(mongo, **request.json).validate()
        result_item = currency.add_item()
    except SchemaError as e:
        return make_response(jsonify({'message': str(e)}), 400)
    except TypeError as e:
        return make_response(jsonify({'message': str(e).replace('__init__()', 'Currency')}), 400)
    return make_response(f'Currency {str(result_item)} Added', 201)


@app.route("/currencies", methods=['DELETE'])
def delete_currency():
    mongo = get_container().get('mongodb')
    currency = Currency(mongo, **request.json).validate()
    result = currency.delete_object()
    return make_response(jsonify(f'Currency {str(result)} removed'), 200)


@app.route("/convert")
def convert():
    container = get_container()
    conversion = container.get('conversion')
    try:
        conversion = conversion(container, **request.args)
        result = conversion.convert()
        return make_response(jsonify({'result': result}), 200)
    except SchemaError as e:
        return make_response(jsonify(e.errors), 400)
    except MissingParameterError as e:
        return make_response(jsonify(e.message), 400)
    except UnableToFindCurrencyError as e:
        return make_response(jsonify(e.message), 400)
    except requests.RequestException as e:
        return make_response(jsonify(e.response), 500)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
