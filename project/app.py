#!env/bin/python
from flask import Flask, jsonify, abort, make_response, request, url_for, g
import sqlite3, requests

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

DATABASE = 'currency.db'
API = 'https://api.coincap.io/v2/rates'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    db.row_factory = make_dicts
    return db

def query_db(query, one=False):
    cur = get_db().execute(query)
    rv = cur.fetchone() if one else cur.fetchall()
    cur.close()
    return rv

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()
    
def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))

@app.route('/')
def index():
    return 'API is running!'

@app.route('/api/currency', methods=['GET'])
def get_currencies():
    all_currencies = query_db('SELECT * FROM currency;')
    return jsonify(all_currencies)

@app.route('/api/currency/<int:currency_id>', methods=['GET'])
def get_currency(currency_id):
    currency = query_db(f'SELECT * FROM currency WHERE id = {currency_id};', True)
    if len(currency) == 0:
        abort(404)
    return jsonify(currency)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/api/currency', methods=['POST'])
def add_currency():
    if not request.json or not 'name' in request.json:
        abort(400)
    try:
        name = request.json['name']
        currency = query_db(f'SELECT * FROM currency WHERE name = "{name}"', True)
        
        if len(currency):
            return jsonify({'sucess': False, 'message': 'Esta moeda já está cadastrada.'}), 201
        
        query_db(f'INSERT INTO currency (name) VALUES ("{name}");')
        return jsonify({'sucess': True, 'message': 'Registro adicionado com sucesso.'}), 201
    except:
        return jsonify({'success': False, 'message': "Ocorreu um erro ao inserir o registro."}), 500

@app.route('/api/currency/<int:currency_id>', methods=['DELETE'])
def delete_currency(currency_id):
    try:
        query_db(f'DELETE FROM currency WHERE id = {currency_id};')
        return jsonify({'success': True, 'message':'Registro excluído com sucesso.'}), 200
    except:
        return jsonify({'success': False, 'message': "Ocorreu um erro ao excluir o registro."}), 500

@app.route('/api', methods=['GET'])
def convert():
    try:
        from_currency_name = request.args.get('from')
        to_currency_name = request.args.get('to')
        amount = request.args.get('amount')

        # verifica se as moedas estão cadastradas no banco
        from_currency = query_db(f'SELECT * FROM currency WHERE name = "{from_currency_name}"', True)
        to_currency = query_db(f'SELECT * FROM currency WHERE name = "{to_currency_name}"', True)
        
        if(not from_currency):
            return jsonify({'success': False, 'message':f'A moeda {from_currency_name} não está cadastrada.'}), 200
        
        if(not to_currency):
            return jsonify({'success': False, 'message':f'A moeda {to_currency_name} não está cadastrada.'}), 200
        
        # busca a cotação das moedas com o USD como base
        r = requests.get(API)
        response = r.json()

        # a resposta da API traz a cotação de todas as moedas, então é necessário encontrar as moedas from e to no response
        to_currency = next((d for d in response['data'] if d['symbol'] == to_currency['name']), None)
        from_currency = next((d for d in response['data'] if d['symbol'] == from_currency['name']), None)

        if to_currency and from_currency:
            # converte cada moeda para o equivalente a 1 USD
            to_currency_usd = 1/float(to_currency['rateUsd'])
            from_currency_usd = 1/float(from_currency['rateUsd'])

            value = (to_currency_usd/from_currency_usd) * float(amount)
            return jsonify({'success': True, 'amount': value}), 200
        else:
            return jsonify({'success': False, 'message':f'Não foi encontrada a cotação para a moeda {to_currency}.'}), 200
    except:
        return jsonify({'success': False, 'message': "Ocorreu um erro ao converter o valor."}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0')