from flask import Flask, request, jsonify

import requests, json

from controllers.currency_controller import currency_controller
from db.operations import DatabaseOperations


app = Flask(__name__)
app.register_blueprint(currency_controller)

if __name__ == '__main__':
    DatabaseOperations.populate_db()
    app.run(debug = True)