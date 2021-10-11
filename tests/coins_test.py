from http import HTTPStatus
from json import loads, dumps
from brcurrency.dolar import Dolar

def test_create_coin_and_list_coin(client):
    response = client.post('/', data=dumps({'name':'abs', 'price': 10}))
    assert response.status_code == HTTPStatus.CREATED 

    response = client.get('/')
    assert response.status_code == HTTPStatus.OK
    coin = loads(response.data)[0]
    assert 'id' in coin
    assert coin['name'] == 'ABS'
    assert coin['price'] == 10


def test_validate_when_creating(client):
    response = client.post('/', data=dumps({'teste': 'teste'}))
    assert response.status_code == HTTPStatus.BAD_REQUEST

    response = client.post('/', data=dumps({'name':'abs', 'price': 10}))
    assert response.status_code == HTTPStatus.CREATED

    response = client.post('/', data=dumps({'name':'abs', 'price': 10}))
    assert response.status_code == HTTPStatus.CONFLICT

    response = client.post('/', data=dumps({'name':'brl', 'price': 10}))
    assert response.status_code == HTTPStatus.CONFLICT 


def test_list_coins_parameters(client):
    client.post('/', data=dumps({'name':'abs', 'price': 10}))
    client.post('/', data=dumps({'name':'iah', 'price': 1}))

    response = client.get('/?name=abs')
    assert response.status_code == HTTPStatus.OK
    coin = loads(response.data)
    assert len(coin) == 1
    assert coin[0]['name'] == 'ABS'

    response = client.get('/?name=iah')
    assert response.status_code == HTTPStatus.OK
    coin = loads(response.data)
    assert len(coin) == 1
    assert coin[0]['name'] == 'IAH'


def test_validator_list_coins(client):
    response = client.get('/?invalid=brl')
    assert response.status_code == HTTPStatus.BAD_REQUEST
    

def test_update_coin(client):
    client.post('/', data=dumps({'name':'abs', 'price': 10}))
    
    response =  client.put('/abs', data=dumps({'price': 15}))
    assert response.status_code == HTTPStatus.OK
    response = client.get('/')
    coin = loads(response.data)[0]
    assert 'id' in coin
    assert coin['name'] == 'ABS'
    assert coin['price'] == 15


def test_validate_in_update_coin(client):
    response = client.put('/BRL', data=dumps({'invalid': '15'}))
    assert response.status_code == HTTPStatus.BAD_REQUEST


def test_delete_coin(client):
    client.post('/', data=dumps({'name':'abs', 'price': 10}))

    response = client.get('/')
    assert len(loads(response.data)) == 1
    response =  client.delete('/abs')
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get('/')
    assert len(loads(response.data)) == 0

def test_not_allowed_to_change_or_delete_default_coins(client):
    response = client.put('/BRL', data=dumps({'price': 15}))
    assert response.status_code == HTTPStatus.FORBIDDEN

    response = client.delete('/BRL')
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_validator_to_calculate_(client):
    response = client.get('/calculate?invalid=invalid&to=eur&amount=10')
    assert response.status_code == HTTPStatus.BAD_REQUEST
    
def test_if_coin_not_has_registered(client):
    response = client.get('/calculate?from=abs&to=eur&amount=10')
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    

def test_calculate_(client):
    USD = Dolar().get_cotacao()
    default_amount = 2
    client.post('/', data=dumps({'name':'abs', 'price': 10}))

    response = client.get(f'/calculate?from=abs&to=brl&amount={default_amount}')
    assert response.status_code == HTTPStatus.OK
    assert loads(response.data)['result'] == '20.00'

    response = client.get(f'/calculate?from=usd&to=brl&amount={default_amount}')
    assert response.status_code == HTTPStatus.OK
    assert loads(response.data)['result'] == '{:.02f}'.format(USD * default_amount)


