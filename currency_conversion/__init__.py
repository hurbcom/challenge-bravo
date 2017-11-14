from flask import Flask
from currency_conversion.api.views import conversion


app = Flask(__name__)

app.register_blueprint(conversion, url_prefix='/api')
