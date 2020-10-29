#--- Main file application to load all other modules ---#

from flask import Flask, jsonify

#load modules 
from src.endpoints.conversion import currency_api
from src.apispec import apispec
from src.endpoints.swagger import swagger_ui, SWAGGER_URL

app = Flask(__name__)

#register blueprints that responsible to structure endpoints
app.register_blueprint(currency_api, url_prefix="/api")
app.register_blueprint(swagger_ui, url_prefix=SWAGGER_URL)

#endpoint to load swagger docs
@app.route("/api/swagger.json")
def swagger_spec():
    return jsonify(apispec.to_dict())