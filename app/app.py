from controllers.currency import Currency
from controllers.exchange import Exchange
from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app)

# TODO: plural ou singular?
api.add_resource(Currency, "/currencies")
api.add_resource(Exchange, "/exchange")

if __name__ == "__main__":
    # TODO: remover debug=True, definier porta
    app.run(debug=True, port=5000)
