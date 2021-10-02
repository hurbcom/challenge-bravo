from flask import request

from config import app


@app.route('/convert', methods=['GET', ])
async def convert_curriencies():
    from currency_exchange.blueprints.return_message.message_return import custom_error

    if not request.args.get("from") or not request.args.get("to"):
        data = {"error": "please, verify the URL contains all paraments"}
        return custom_error(data, 409)

    from currency_exchange.controller.convert_currencies import converting_currencies_and_return_dict
    return converting_currencies_and_return_dict(
        str(request.args.get("from")).upper(),
        str(request.args.get("to")).upper(),
        request.args.get("amount") or str(1)
    )


@app.route("/currencies", methods=['POST', 'DELETE', 'GET'])
async def create_and_delete_currencie():
    request_data = request.get_json()

    if request.method == 'GET':
        from currency_exchange.controller.create_and_delete_currencies \
            import get_creating_and_deleting_currencies

        return get_creating_and_deleting_currencies()

    if request.method == 'POST':
        from currency_exchange.controller.create_and_delete_currencies \
            import post_creating_and_deleting_currencies
        return post_creating_and_deleting_currencies(request_data)

    if request.method == 'DELETE':
        from currency_exchange.controller.create_and_delete_currencies \
            import delete_creating_and_deleting_currencies
        return delete_creating_and_deleting_currencies(request_data)

#
# @app.before_first_request
# def creating_database():
#     from currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate
#     from currency_exchange.blueprints.scrapping.publicAPI import default_currencies
#
#     # Updating database with default currencies if database empty.
#     if not bool(reading_all_symbols_from_table_exchange_rate()):
#         default_currencies()
#
#
# @app.route("/testing")
# async def testing_gargalo():
#     import requests
#     r = requests.get("https://api.exchangerate.host/convert?from=BRL&to=USD")
#     return r.json()

