from flask import Flask
from currency_conversion.api.views import conversion
from redis import Redis


app = Flask(__name__)

with app.app_context():
    app.redis = Redis(host='redis')
    app.register_blueprint(conversion, url_prefix='/api')
