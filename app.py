from flask_cors import CORS
from flask import Flask
from flask_caching import Cache
from src.coins.api import app as coins_app
from config import mongo

def create_app(connection=None):
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(coins_app)
    app.config['mongodb'] = mongo()  if not connection \
            else connection
    app.config['CACHE_TYPE'] = 'SimpleCache'
    app.config['CACHE_DEFAULT_TIMEOUT'] = '600'
    cache = Cache(app)
    app.cache = cache
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0')

