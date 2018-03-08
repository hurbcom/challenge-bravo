from flask_caching import Cache
from flask import request, jsonify
from app.converter import Converter
from webargs import fields
from webargs.flaskparser import use_args
from flask import Flask
from redis import Redis


app = Flask(__name__)

with app.app_context():
    app.redis = Redis(host='redis')

# This cache improve a better performance on equals requests
cache = Cache(config={'CACHE_TYPE': 'simple'})

converter_args = {
    'to': fields.Str(required=True),
    'from': fields.Str(required=True),
    'amount': fields.Float(required=True)
}

# Improve better performance caching de same requests
@cache.cached(timeout=50)
@app.route("/converter/")
@use_args(converter_args)
def converter(args):
    from_cur= str(args['from']).upper()
    to_cur = str(args['to']).upper()
    amount = float(args['amount'])
    converted, rate = Converter(from_cur, to_cur, amount).get()
    if converted == 0:
       return jsonify({'Erro': 'Base currency %s not found' % (from_cur)}), 400
    return jsonify([{'from': from_cur, 'to': to_cur, 'rate': rate, 'amount': amount, 'converted_amount': converted }])

if __name__ == "__main__":
    cache.init_app(app)
    app.run()