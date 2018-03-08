from flask import request, jsonify
from api.converter import Converter
from webargs import fields
from webargs.flaskparser import use_args
from api import app

# Query string validators
converter_args = {
    'to': fields.Str(required=True),
    'from': fields.Str(required=True),
    'amount': fields.Float(required=True)
}

@app.route("/converter/")
@use_args(converter_args)
def converter(args):
    from_cur= str(args['from']).upper()
    to_cur = str(args['to']).upper()
    amount = float(args['amount'])
    converted, rate = Converter(from_cur, to_cur, amount).get()
    if converted == 0:
       return jsonify({'Erro': 'Base currency %s or destination currency %s not found' % (from_cur, to_cur)}), 400
    return jsonify([{'from': from_cur, 'to': to_cur, 'rate': rate, 'amount': amount, 'converted_amount': converted }])

if __name__ == "__main__":
    app.run()