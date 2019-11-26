from controllers.currency import Currency
from controllers.exchange import Exchange
from controllers.healthcheck import Healthcheck
from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app)

api.add_resource(Currency, "/currencies")
api.add_resource(Exchange, "/exchange")
api.add_resource(Healthcheck, "/healthcheck")

if __name__ == "__main__":
    app.run(port=5000, debug=True, host='0.0.0.0')
