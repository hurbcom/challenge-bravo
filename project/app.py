#!env/bin/python
from flask import Flask, jsonify, abort, make_response, request, url_for, g
import sqlite3, requests
import database as db

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

API = 'https://api.coincap.io/v2/rates'

@app.route('/')
def index():
    return 'API is running!'

@app.route('/api/currency', methods=['GET'])
def get_currencies():
    all_currencies = db.query('SELECT * FROM currency;')
    return jsonify(all_currencies)

@app.route('/api/currency/<int:currency_id>', methods=['GET'])
def get_currency(currency_id):
    currency = db.query(f'SELECT * FROM currency WHERE id = {currency_id};', True)
    if not currency:
        abort(404)
    return jsonify(currency)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/api/currency', methods=['POST'])
def add_currency():
    if not request.json or not 'code' in request.json:
        abort(400)
    try:
        code = request.json['code']
        currency = db.query(f'SELECT * FROM currency WHERE code = "{code}"', True)
        
        if currency:
            return jsonify({'sucess': False, 'message': 'Esta moeda já está cadastrada.'}), 201    

        db.transaction(f'INSERT INTO currency (code) VALUES ("{code}");')
        return jsonify({'sucess': True, 'message': 'Registro adicionado com sucesso.'}), 201
    except:
        return jsonify({'success': False, 'message': "Ocorreu um erro ao inserir o registro."}), 500

@app.route('/api/currency/<int:currency_id>', methods=['DELETE'])
def delete_currency(currency_id):
    try:
        db.transaction(f'DELETE FROM currency WHERE id = {currency_id};')
        return jsonify({'success': True, 'message':'Registro excluído com sucesso.'}), 200
    except:
        return jsonify({'success': False, 'message': "Ocorreu um erro ao excluir o registro."}), 500

@app.route('/api', methods=['GET'])
def convert():
    try:
        from_currency_code = request.args.get('from')
        to_currency_code = request.args.get('to')
        amount = request.args.get('amount')

        # verifica se as moedas estão cadastradas no banco
        from_currency = db.query(f'SELECT * FROM currency WHERE code = "{from_currency_code}"', True)
        to_currency = db.query(f'SELECT * FROM currency WHERE code = "{to_currency_code}"', True)
        
        if(not from_currency):
            return jsonify({'success': False, 'message':f'A moeda {from_currency_code} não está cadastrada.'}), 200
        
        if(not to_currency):
            return jsonify({'success': False, 'message':f'A moeda {to_currency_code} não está cadastrada.'}), 200
        
        # busca a cotação das moedas com o USD como base
        r = requests.get(API)
        response = r.json()

        # a resposta da API traz a cotação de todas as moedas, então é necessário encontrar as moedas from e to no response
        to_currency = next((d for d in response['data'] if d['symbol'] == to_currency['code']), None)
        from_currency = next((d for d in response['data'] if d['symbol'] == from_currency['code']), None)

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
    db.init()
    app.run(debug=True, host='0.0.0.0')