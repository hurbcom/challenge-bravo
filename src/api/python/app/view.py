from flask import request, jsonify
from flask_voluptuous import expect, Schema, Required
from converter import Converter

# Improve better performance caching de same requests
@cache.cached(timeout=50)
@app.route("/converter/")
@expect(Schema({  # Validate query string
    Required('from'): str,
    Required('to'): str,
    Required('amount'): float,
  }), 'args')
def converter(args):
    from_cur= str(args['from']).upper()
    to_cur = str(args['to']).upper()
    amount = float(args['amount'])
    converted = Converter(from_cur, to_cur, amount)
    if converted == 0:
       return jsonify({'Erro': 'Base currency %s not found' % (to_cur)}), 400
    return jsonify([{'from': from_cur, 'to': to_cur, 'amount': amount, 'converted_amount': converted }])
