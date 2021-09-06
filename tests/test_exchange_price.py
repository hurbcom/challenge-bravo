import pytest
from challengebravo.db import get_db
from challengebravo.currency_dao import Currency, retrieveCurrency, retrieveValue



@pytest.mark.parametrize('symbol, usd_value', [('ADA', 0.34131440176118233), ('XRP', 0.8058215514298602), ('doge', 3.434655675768504)])
def test_create(client, app, symbol, usd_value):
    response = client.post('/exchangePrice/createCurrency', json={'symbol': symbol, 'usd_value': usd_value})
    assert response.status_code == 200

    with app.app_context():
        assert retrieveCurrency(symbol.upper()) is not None


@pytest.mark.parametrize('symbol, usd_value', [('WLUNA', 0.03069838833461243), ('aed', 3.6732), ('ANG', 1.790838)])
def test_create_delete(client, app, symbol, usd_value):
    with app.app_context():
        response = client.post('/exchangePrice/createCurrency', json={'symbol': symbol, 'usd_value': usd_value})
        assert response.status_code == 200
        assert retrieveCurrency(symbol.upper()) is not None
        response = client.post('exchangePrice/deleteCurrency', json={'symbol': symbol})
        assert response.status_code == 200
        assert retrieveCurrency(symbol.upper()) is None




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