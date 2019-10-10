#!env/bin/python
from flask import Flask, jsonify, abort, make_response, request, url_for, g
import sqlite3, requests

app = Flask(__name__)

DATABASE = 'currency.db'

API = 'https://api.exchangeratesapi.io/latest?base=USD'

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
        from_currency = request.args.get('from')
        to_currency = request.args.get('to')
        amount = request.args.get('amount')

        # verifica se as moedas estão cadastradas no banco
        from_currency = query_db(f'SELECT * FROM currency WHERE name = "{from_currency}"', True)
        to_currency = query_db(f'SELECT * FROM currency WHERE name = "{to_currency}"', True)
        
        if(not len(from_currency)):
            return jsonify({'success': False, 'message':f'A moeda {from_currency} não está cadastrada.'}), 200
        
        if(not len(to_currency)):
            return jsonify({'success': False, 'message':f'A moeda {to_currency} não está cadastrada.'}), 200
        
        # busca a cotação das moedas com o USD como base
        r = requests.get(API)
        response = r.json()

        if(to_currency['name'] in response['rates']):
            to_currency_rate = response['rates'][to_currency['name']]
            from_currency_rate = response['rates'][from_currency['name']]
            
            value = (to_currency_rate/from_currency_rate) * float(amount)
            
            return jsonify({'success': True, 'amount': value}), 200
        else:
            return jsonify({'success': False, 'message':f'A moeda {to_currency} não está cadastrada.'}), 200
    except:
        return jsonify({'success': False, 'message': "Ocorreu um erro ao converter o valor."}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0')