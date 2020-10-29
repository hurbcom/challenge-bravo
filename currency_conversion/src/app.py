#Main file application to load all other modules
from flask import Flask

#load modules 
from src.endpoints.conversion import currency_api

app = Flask(__name__)

#register blueprints that responsible to structure endpoints
app.register_blueprint(currency_api, url_prefix="/api", errors=errors)

