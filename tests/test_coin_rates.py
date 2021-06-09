import json
from unittest.mock import Mock


from views.coin_rates import set_coin_rates_external_api_to_redis, convert_two_currencies, set_fake_coin_to_redis, \
    remove_rate_from_redis


class HttpResult():
    status_code: int
    content: str

    def __init__(self, status_code, content):
        self.status_code = status_code
        self.content = content

def test_set_coin_rates_external_api_to_redis(mocker):
    mocker.patch('db.redis.redis.Redis.exists', return_value=False)
    mocker.patch('db.redis.redis.Redis.set', return_value=True)
    file = open('tests/files/result_search_api.json', encoding="utf8").read()
    mocker.patch('views.coin_rates.requests.get', return_value=HttpResult(200, file))
    result = set_coin_rates_external_api_to_redis()
    assert not result

def test_convert_two_currencies(mocker):
    m = Mock()
    m.args = {'from': 'BTC', 'to': 'BRL', 'amount': 1}
    mocker.patch('views.coin_rates.set_coin_rates_external_api_to_redis')
    mocker.patch('views.coin_rates.request', m)
    mocker.patch('views.coin_rates.jsonify', return_value=json.dumps({'convertedValue': 1.0}))
    mocker.patch('db.redis.redis.Redis.mget', return_value=[1, 1])
    result = convert_two_currencies()
    assert result == json.dumps({'convertedValue': 1.0})

def test_set_fake_coin_to_redis(mocker):
    m = Mock()
    m.data = open('tests/files/request_data.json').read()
    mocker.patch('views.coin_rates.request', m)
    mocker.patch('views.coin_rates.jsonify', return_value=json.dumps({"message": f'success to register BTC to the database!'}))
    mocker.patch('db.redis.redis.Redis.set')
    result = set_fake_coin_to_redis()
    assert result == json.dumps({"message": f'success to register BTC to the database!'})

def test_remove_rate_from_redis(mocker):
    m = Mock()
    m.data = open('tests/files/request_data.json').read()
    mocker.patch('views.coin_rates.request', m)
    mocker.patch('db.redis.redis.Redis.delete')
    mocker.patch('views.coin_rates.jsonify', return_value=json.dumps({"message": f'success to delete BTC from the database!'}))
    result = remove_rate_from_redis()
    assert json.dumps({"message": f'success to delete BTC from the database!'}) == result
