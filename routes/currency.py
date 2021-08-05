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


    @app.route(base, methods=['GET'])
    def list():
        return make_response(jsonify({"message": "This will list all Currency!"+ os.path.abspath(f"database/{os.getenv('DB_NAME')}")}), 200)


