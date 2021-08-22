from sanic import Sanic
from sanic.response import json

app = Sanic("Currency convertion API")

# TODO: remove once completed
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
    return json({'/getAllReal': 'TODO: implementation pending'})


@app.get('/allCurrencies')
async def get_all_currencies(request):
    return json({'/getAllCurrencies': 'TODO: implementation pending'})


if __name__ == '__main__':
    app.run()
