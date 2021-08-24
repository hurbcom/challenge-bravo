from sanic import Sanic
from sanic.response import json

from .convertion_service import ConvertionService

app = Sanic("Currency convertion API")
convertion_service = ConvertionService()

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
    return json(convertion_service.get_all_user_created_currencies())


@app.get('/allReal')
async def get_all_real_currencies(request):
    return json(convertion_service.get_all_real_currencies())


@app.get('/allCurrencies')
async def get_all_currencies(request):
    return json(convertion_service.get_all_currencies())


if __name__ == '__main__':
    app.run()
