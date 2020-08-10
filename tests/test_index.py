import sys
import os
sys.path.append( os.path.dirname( os.path.dirname( os.path.abspath(__file__) ) ) )

import pytest
import tempfile

from app import app
from db.operations import DatabaseOperations
from models.currency import Currency

@pytest.fixture
def client():
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    DatabaseOperations.populate_db()
    
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            DatabaseOperations.populate_db()
        yield client
    
    os.close(db_fd)
    os.unlink(app.config['DATABASE'])


def test_index_json_result_format(client):
    currency_from = 'BRL'
    currency_to = 'EUR'
    amount = 170

    res = client.get('/?from={0}&to={1}&amount={2}'.format(currency_from, currency_to, amount))
    result_json = res.get_json()

    assert res.status_code == 200

    assert '_links' in result_json
    assert 'usd_to_currency_from' in result_json['_links']
    assert 'usd_to_currency_from' in result_json['_links']
    assert 'list_all_currencys' in result_json['_links']
    assert 'url' in result_json['_links']    

    assert result_json['_links']['list_all_currencys'] == 'http://localhost/currencies'
    assert result_json['_links']['usd_to_currency_from'] == 'http://localhost/currencies/' + currency_from
    assert result_json['_links']['usd_to_currency_to'] == 'http://localhost/currencies/' + currency_to

    assert 'original' in result_json
    assert 'currency' in result_json['original']
    assert 'value' in result_json['original']

    assert 'converted' in result_json
    assert 'currency' in result_json['converted']
    assert 'value' in result_json['converted']


def test_index_result(client):
    currency_from = 'BRL'
    currency_to = 'EUR'
    amount = 150

    c1 = Currency()
    c2 = Currency()

    c_from = c1.find_by_symbol(currency_from)
    c_to = c2.find_by_symbol(currency_to)

    expected_result = (c_to["value"] / c_from["value"]) * amount

    res = client.get('/?from={0}&to={1}&amount={2}'.format(currency_from, currency_to, amount))
    result_json = res.get_json()
    
    assert res.status_code == 200
    
    assert result_json['original']['currency'] == currency_from
    assert result_json['original']['value'] == amount

    assert result_json['converted']['currency'] == currency_to
    assert result_json['converted']['value'] == expected_result


def test_index_arguments_missing(client):
    currency_from = 'BRL'
    currency_to = 'EUR'
    amount = 150
    
    # Teste sem o from
    res = client.get('/?to={0}&amount={1}'.format(currency_to, amount))
    result_json = res.get_json()

    assert res.status_code == 412

    assert 'error' in result_json
    assert result_json['error'] == 'Arguments missing'
    
    # Teste sem o to
    res = client.get('/?from={0}&amount={1}'.format(currency_from, amount))
    result_json = res.get_json()

    assert res.status_code == 412

    assert 'error' in result_json
    assert result_json['error'] == 'Arguments missing'
    
    # Teste sem o amount
    res = client.get('/?from={0}&to={1}'.format(currency_from, currency_to))
    result_json = res.get_json()

    assert res.status_code == 412

    assert 'error' in result_json
    assert result_json['error'] == 'Arguments missing'


def test_index_invalid_amount(client):
    currency_from = 'BRL'
    currency_to = 'EUR'
    amount = 'Ola'
    
    res = client.get('/?from={0}&to={1}&amount={2}'.format(currency_from, currency_to, amount))
    result_json = res.get_json()

    assert res.status_code == 412

    assert 'error' in result_json
    assert result_json['error'] == 'Invalid Amount Format'


def test_index_currency_not_found(client):
    currency_from = 'XIP'
    currency_to = 'EUR'
    amount = 150
    
    res = client.get('/?from={0}&to={1}&amount={2}'.format(currency_from, currency_to, amount))
    result_json = res.get_json()

    assert res.status_code == 404

    assert 'error' in result_json
    assert result_json['error'] == 'Currency not Found'
    
    currency_from = 'BRL'
    currency_to = 'XIP'

    res = client.get('/?from={0}&to={1}&amount={2}'.format(currency_from, currency_to, amount))
    result_json = res.get_json()

    assert res.status_code == 404

    assert 'error' in result_json
    assert result_json['error'] == 'Currency not Found'



