from sanic import Sanic
from sanic.response import json

from .conversion_service import ConversionService

app = Sanic("Currency conversion API")
conversion_service = ConversionService()


@app.get('/convert')
async def convert(request):
    currency_to = request.args.get('to')
    currency_from = request.args.get('from')
    amount = request.args.get('amount')
    return json(conversion_service.convert(currency_from, currency_to, amount))


@app.post('/create')
async def create_currency(request):
    name = request.args.get('name')
    base_value = request.args.get('base_value')
    return json(conversion_service.create_currency(name, base_value))


@app.put('/update')
async def update_currency(request):
    name = request.args.get('name')
    new_base_value = request.args.get('new_base_value')
    return json(conversion_service.update_currency(name, new_base_value))


@app.delete('/delete')
async def delete_currency(request):
    name = request.args.get('name')
    return json(conversion_service.delete_currency(name))


@app.get('/allUserCreated')
async def get_all_user_created_currencies(request):
    return json(conversion_service.get_all_user_created_currencies())


@app.get('/allReal')
async def get_all_real_currencies(request):
    return json(conversion_service.get_all_real_currencies())


@app.get('/allCurrencies')
async def get_all_currencies(request):
    return json(conversion_service.get_all_currencies())


if __name__ == '__main__':
    app.run()
