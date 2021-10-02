from flask import request

from challenge_bravo.config import app


@app.route('/convert', methods=['GET', ])
def convert_curriencies():
    from challenge_bravo.currency_exchange.blueprints.return_message.message_return import custom_error
    if not request.args.get("from") or not request.args.get("to"):
        data = {"error": "please, verify the URL contains all paraments"}
        return custom_error(data, 409)

    from challenge_bravo.currency_exchange.controller.convert_currencies import converting_currencies_and_return_dict
    return converting_currencies_and_return_dict(
        f=str(request.args.get("from")).upper(),
        t=str(request.args.get("to")).upper(),
        a=request.args.get("amount") or str(1)
    )


@app.route("/currencies", methods=['POST', 'DELETE', 'GET'])
def create_and_delete_currencie():
    request_data = request.get_json()

    if request.method == 'GET':
        from challenge_bravo.currency_exchange.controller.create_and_delete_currencies \
            import get_creating_and_deleting_currencies

        return get_creating_and_deleting_currencies()

    if request.method == 'POST':
        from challenge_bravo.currency_exchange.controller.create_and_delete_currencies \
            import post_creating_and_deleting_currencies
        return post_creating_and_deleting_currencies(request_data)

    if request.method == 'DELETE':
        from challenge_bravo.currency_exchange.controller.create_and_delete_currencies \
            import delete_creating_and_deleting_currencies
        return delete_creating_and_deleting_currencies(request_data)


@app.route("/testing")
def testing_gargalo():
    return {'olá': "mundo"}

