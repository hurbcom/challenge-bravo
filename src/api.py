from sanic import Sanic
from sanic.response import json

from .redis_connector import RedisConnector

app = Sanic("Currency convertion API")
connection = RedisConnector().get_connection()

# TODO: remove def test() once completed


@app.route('/')
async def test(request):
    return json({'hello': 'world'})


@app.get('/convert')
async def convert(request):
    return json({'/convert': f'TODO: implementation pending - {request.args}'})


@app.post('/create')
async def create_currency(request):
    return json({'/create': 'TODO: implementation pending'})


@app.put('/update')
async def update_currency(request):
    return json({'/update': f'TODO: implementation pending - {request.args}'})


@app.delete('/delete')
async def delete_currency(request):
    return json({'/delete': f'TODO: implementation pending - {request.args}'})


@app.get('/allUserCreated')
async def get_all_user_created_currencies(request):
    return json({'/getAllUserCreated': 'TODO: implementation pending'})


@app.get('/allReal')
async def get_all_real_currencies(request):
    # manual exploration test only, will be removed in order to not break RGF
    return_dict = {'currencies': []}
    for currency in connection.scan_iter('curr_*'):
        return_dict['currencies'].append(currency.decode('utf-8').replace('curr_', ''))
    print(return_dict)
    return json(return_dict)


@app.get('/allCurrencies')
async def get_all_currencies(request):
    return json({'/getAllCurrencies': 'TODO: implementation pending'})


if __name__ == '__main__':
    app.run()
