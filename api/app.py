import json

from flask import Flask, Response
app = Flask(__name__)


@app.route('/exchange/')
def hello_world():
    response = {
        'from': 'USD',
        'to': 'BRL',
        'amount': '1',
        'value': '5,15'
    }

    return Response(json.dumps(response), status=200, mimetype='application/json')