from http import HTTPStatus
from json import loads, dumps

def test_create_coin_and_list_coin(client):
    response = client.post('/', data=dumps({'name':'brl', 'price': 10}))
    assert response.status_code == HTTPStatus.CREATED 

    response = client.get('/')
    assert response.status_code == HTTPStatus.OK
    coin = loads(response.data)[0]
    assert 'id' in coin
    assert coin['name'] == 'BRL'
    assert coin['price'] == 10


def test_validate_when_creating(client):
    response = client.post('/', data=dumps({'teste': 'teste'}))
    assert response.status_code == HTTPStatus.BAD_REQUEST

    response = client.post('/', data=dumps({'name':'brl', 'price': 10}))
    assert response.status_code == HTTPStatus.CREATED

    response = client.post('/', data=dumps({'name':'brl', 'price': 10}))
    assert response.status_code == HTTPStatus.CONFLICT 


def test_list_coins_parameters(client):
    client.post('/', data=dumps({'name':'brl', 'price': 10}))
    client.post('/', data=dumps({'name':'usd', 'price': 1}))

    response = client.get('/?name=brl')
    assert response.status_code == HTTPStatus.OK
    coin = loads(response.data)
    assert len(coin) == 1
    assert coin[0]['name'] == 'BRL'

    response = client.get('/?name=usd')
    assert response.status_code == HTTPStatus.OK
    coin = loads(response.data)
    assert len(coin) == 1
    assert coin[0]['name'] == 'USD'


def test_validator_list_coins(client):
    response = client.get('/?invalid=brl')
    assert response.status_code == HTTPStatus.BAD_REQUEST
    

def test_update_coin(client):
    client.post('/', data=dumps({'name':'brl', 'price': 10}))
    
    response =  client.put('/brl', data=dumps({'price': 15}))
    assert response.status_code == HTTPStatus.OK
    response = client.get('/')
    coin = loads(response.data)[0]
    assert 'id' in coin
    assert coin['name'] == 'BRL'
    assert coin['price'] == 15


def test_validate_in_update_coin(client):
    response = client.put('/BRL', data=dumps({'invalid': '15'}))
    assert response.status_code == HTTPStatus.BAD_REQUEST


def test_delete_coin(client):
    client.post('/', data=dumps({'name':'brl', 'price': 10}))

    response = client.get('/')
    assert len(loads(response.data)) == 1
    response =  client.delete('/brl')
    assert response.status_code == HTTPStatus.OK
    response = client.get('/')
    assert len(loads(response.data)) == 0


def test_validator_to_calculate_(client):
    response = client.get('/calculate?invalid=invalid&to=eur&amount=10')
    assert response.status_code == HTTPStatus.BAD_REQUEST
    

def test_calculate_(client):
    client.post('/', data=dumps({'name':'brl', 'price': 1}))
    client.post('/', data=dumps({'name':'eur', 'price': 2}))

    response = client.get('/calculate?from=brl&to=eur&amount=10')
    assert response.status_code == HTTPStatus.OK
    assert loads(response.data)['result'] == 5

    response = client.get('/calculate?from=eur&to=brl&amount=10')
    assert response.status_code == HTTPStatus.OK
    assert loads(response.data)['result'] == 20


