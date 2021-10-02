from flask import request

from config import app


@app.route('/convert', methods=['GET', ])
async def convert_curriencies() -> object:
    """
    This is the method responsible for API conversion.
    This method will only do a validation before sending all the information to the CONTROLLER.

    :methods available: GET
    :return: A object with JSON and status code
    """

    from currency_exchange.blueprints.return_message.json_return_with_code import custom_error

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
async def create_and_delete_currencie() -> object:
    """
    Here is the view of /currencies, user can send 3 type of method, POST, DELETE and GET.
    This method will get all informations in body of message ( in the case of DELETE and POST ) and send to
    method in CONTROLLER.

    :methods available: GET, POST and DELETE
    :return: A object with JSON and status code
    """
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
