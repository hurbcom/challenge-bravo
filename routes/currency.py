from flask_login import current_user, login_required
from flask import Flask, request, make_response, jsonify
import os
from controllers.currency import CurrencyController


def currencyRoutes(app):

    ctrl = CurrencyController()
    base = '/currency'

    @app.route(base+'/converter/', methods=['GET'])
    def converter():
        if not request.args.get('from'):
            return make_response(jsonify({"message": "You need provide a source currency!"}), 400)

        if not request.args.get('to'):
            return make_response(jsonify({"message": "You need provide a destiny currency!"}), 400)

        if not request.args.get('amount'):
            return make_response(jsonify({"message": "You need provide the amount value!"}), 400)

        source = request.args.get('from')
        destiny = request.args.get('to')
        amount = request.args.get('amount')
        amount = float(amount)

        return ctrl.converter(source, destiny, amount)

    @app.route(base+'/add', methods=['POST'])
    @login_required
    def create():
        code = request.get_json()['code']
        in_usd = request.get_json()['in_usd']
        return ctrl.create(code, in_usd)

    @app.route(base+'/list', methods=['GET'])
    def listAll():
        return ctrl.getAll()

    @app.route(base+'/<code>/', methods=['GET'])
    def getOne(code):
        return ctrl.get(code)

    @app.route(base+'/delete/<code>/', methods=['DELETE'])
    @login_required
    def delete(code):
        return ctrl.delete(code)




