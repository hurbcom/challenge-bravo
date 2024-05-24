import json
from flask import Flask
import pytest
from app.models import Currency

def test_list_currencies(client: Any, app: Flask):
    # Adicionando algumas moedas de exemplo ao banco de dados
    currency1 = Currency(code='AAA', name='Currency AAA', rate_to_usd=1.0)
    currency2 = Currency(code='BBB', name='Currency BBB', rate_to_usd=2.0)
    currency3 = Currency(code='CCC', name='Currency CCC', rate_to_usd=3.0)
    db.session.add_all([currency1, currency2, currency3])
    db.session.commit()

    # Fazendo solicitação GET para a rota /currencies
    response = client.get('/currencies')

    # Verificando se o status code é 200 OK
    assert response.status_code == 200

    # Verificando se os dados retornados correspondem às moedas adicionadas
    data = json.loads(response.data.decode('utf-8'))
    assert len(data) == 3
    assert data[0]['code'] == 'AAA'
    assert data[1]['code'] == 'BBB'
    assert data[2]['code'] == 'CCC'

    # Você pode adicionar mais verificações conforme necessário

def test_convert_currency(client: Any, app: Flask):
    # Adicionando algumas moedas de exemplo ao banco de dados
    currency1 = Currency(code='USD', name='US Dollar', rate_to_usd=1.0)
    currency2 = Currency(code='EUR', name='Euro', rate_to_usd=0.85)
    currency3 = Currency(code='GBP', name='British Pound', rate_to_usd=0.72)
    db.session.add_all([currency1, currency2, currency3])
    db.session.commit()

    # Fazendo solicitação GET para a rota /convert com parâmetros de exemplo
    response = client.get('/convert?from=USD&to=EUR&amount=100')

    # Verificando se o status code é 200 OK
    assert response.status_code == 200

    # Verificando se o resultado da conversão está correto
    data = json.loads(response.data.decode('utf-8'))
    assert 'result' in data
    assert data['result'] == 85.0

    # Você pode adicionar mais verificações conforme necessário

def test_add_currency(client: Any, app: Flask):
    # Dados de exemplo para adicionar uma nova moeda
    new_currency_data = {
        'code': 'JPY',
        'name': 'Japanese Yen',
        'rate_to_usd': 110.0
    }

    # Fazendo solicitação POST para a rota /currencies com os dados de exemplo
    response = client.post('/currencies', json=new_currency_data)

    # Verificando se o status code é 201 Created
    assert response.status_code == 201

    # Verificando se a moeda foi adicionada corretamente
    assert Currency.query.filter_by(code='JPY').first() is not None

    # Você pode adicionar mais verificações conforme necessário

def test_delete_currency(client: Any, app: Flask):
    # Adicionando uma moeda de exemplo ao banco de dados
    currency = Currency(code='JPY', name='Japanese Yen', rate_to_usd=110.0)
    db.session.add(currency)
    db.session.commit()

    # Fazendo solicitação DELETE para a rota /currencies/<int:currency_id> com o ID da moeda de exemplo
    response = client.delete('/currencies/{}'.format(currency.id))

    # Verificando se o status code é 200 OK
    assert response.status_code == 200

    # Verificando se a moeda foi excluída corretamente
    assert Currency.query.filter_by(code='JPY').first() is None
