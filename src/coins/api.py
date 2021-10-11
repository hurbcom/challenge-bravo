from flask import Blueprint, request, Response
from http import HTTPStatus
from json import loads
from src.validators.validator import validator
from src.validators.coinsValidator import coins_validator, list_coins_validator, calculate_price_validator
from .Coins import Coins
from .Calculate import Calculate

app = Blueprint('coins', __name__)


@app.route("/", methods=['GET'])
def list_coins():
    filters = request.args.to_dict()
    validator(list_coins_validator, filters)
    return Coins().list(filters)


@app.route("/", methods=['POST'])
def create_coin():
    data = loads(request.data)
    validator(coins_validator, data)
    return Coins().insert(data)


@app.route("/<name>", methods=['PUT'])
def update_coin(name):
    price = loads(request.data).get('price')
    data = {'name': name, 'price': price}
    validator(coins_validator, data)
    Coins().update(name, price)
    return Response(status=HTTPStatus.OK)


@app.route("/<name>", methods=['DELETE'])
def delete_coin(name):
    Coins().delete(name)
    return Response(status=HTTPStatus.NO_CONTENT)


@app.route("/calculate", methods=['GET'])
def calculate():
    params = request.args.to_dict()
    validator(calculate_price_validator, {
        'from':params.get('from'),
        'to': params.get('to'),
        'amount':float(params.get('amount'))
    })
    return Calculate().calculate(
        params.get('from'),
        params.get('to'),
        float(params.get('amount'))
    )