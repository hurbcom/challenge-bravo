from flask import Blueprint, request, jsonify
from .models import Currency
from . import db 

bp = Blueprint('api', __name__)

@bp.route('/convert', methods=['GET'])
def convert():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    amount = float(request.args.get('amount'))

    if not from_currency or not to_currency or not amount:
        return jsonify({"error": "Missing required parameters"}), 400

    from_currency = from_currency.upper()
    to_currency = to_currency.upper()

    from_curr = Currency.query.filter_by(code=from_currency).first()
    to_curr = Currency.query.filter_by(code=to_currency).first()

    if not from_curr or not to_curr:
        return jsonify({"error": "Currency not supported"}), 400

    converted_amount = (amount / from_curr.rate_to_usd) * to_curr.rate_to_usd
    return jsonify({"result": converted_amount}), 200

@bp.route('/currencies', methods=['GET'])
def list_currencies():
    currencies = Currency.query.all()
    currency_list = [{
        'code': currency.code,
        'name': currency.name,
        'rate_to_usd': currency.rate_to_usd
    } for currency in currencies]
    return jsonify(currency_list), 200

@bp.route('/currencies', methods=['POST'])
def add_currency():
    data = request.get_json()
    
    # Verificação dos dados recebidos
    if not data or not 'code' in data or not 'name' in data or not 'rate_to_usd' in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    code = data['code'].upper()
    name = data['name']
    try:
        rate_to_usd = float(data['rate_to_usd'])
    except ValueError:
        return jsonify({'error': 'Invalid rate_to_usd value'}), 400

    new_currency = Currency(code=code, name=name, rate_to_usd=rate_to_usd)

    try:
        db.session.add(new_currency)
        db.session.commit()
        return jsonify({'message': 'Currency added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add currency', 'details': str(e)}), 500

@bp.route('/currencies/<int:currency_id>', methods=['DELETE'])
def delete_currency(currency_id):
    currency = Currency.query.get(currency_id)
    if currency:
        db.session.delete(currency)
        db.session.commit()
        return jsonify({'message': 'Currency deleted successfully'}), 200
    else:
        return jsonify({'error': 'Currency not found'}), 404