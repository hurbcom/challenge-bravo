import pytest
from challengebravo.db import get_db
from challengebravo.currency_dao import Currency, retrieveValue


@pytest.mark.parametrize('symbol, equivalent_to_usd', [('ADA', 0.34131440176118233), ('XRP', 0.8058215514298602), ('DOGE', 3.434655675768504)])
def test_create(client, app, symbol, equivalent_to_usd):
    response = client.post('/exchangePrice/createCurrency', json={'symbol': symbol, 'equivalent_to_usd': equivalent_to_usd})
    assert response.status_code == 200
    client.post('/create', data={'title': 'created', 'body': ''})

    with app.app_context():
        assertion_currency = Currency(symbol)
        assert equivalent_to_usd == retrieveValue(assertion_currency)


# def test_update(client, auth, app):
#     auth.login()
#     assert client.get('/1/update').status_code == 200
#     client.post('/1/update', data={'title': 'updated', 'body': ''})

#     with app.app_context():
#         db = get_db()
#         post = db.execute('SELECT * FROM post WHERE id = 1').fetchone()
#         assert post['title'] == 'updated'


# @pytest.mark.parametrize('path', (
#     '/create',
#     '/1/update',
# ))
# def test_create_update_validate(client, auth, path):
#     auth.login()
#     response = client.post(path, data={'title': '', 'body': ''})
#     assert b'Title is required.' in response.data

# def test_delete(client, auth, app):
#     auth.login()
#     response = client.post('/1/delete')
#     assert response.headers['Location'] == 'http://localhost/'

#     with app.app_context():
#         db = get_db()
#         post = db.execute('SELECT * FROM post WHERE id = 1').fetchone()
#         assert post is None