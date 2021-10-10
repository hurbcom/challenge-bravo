from flask_cors import CORS
from flask import Flask
from src.coins.api import app as coins_app
from config import mongo
from src.utils.default_coins.insert import insert_default_coins


def create_app(connection=None):
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(coins_app)
    app.config['mongodb'] = mongo()  if not connection \
            else connection
    
    return app


app = create_app()
insert_default_coins(app)


if __name__ == '__main__':
    app.run(host='0.0.0.0')

