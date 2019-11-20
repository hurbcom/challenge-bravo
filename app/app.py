from flask import Flask
from flask_restful import Api
from controllers.currency import Currency
from controllers.exchange import Exchange

app = Flask(__name__)
api = Api(app)

api.add_resource(Currency, "/currencies")
api.add_resource(Exchange, "/exchange")

if __name__ == "__main__":
    # TODO: remover debug=True, definier porta
    app.run(debug=True)
