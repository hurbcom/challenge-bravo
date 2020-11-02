#--- Main file application to load all other modules ---#

from flask import Flask, jsonify, render_template

#load modules 
from src.endpoints.conversion import currency_api
from src.apispec import apispec
from src.endpoints.swagger import swagger_ui, SWAGGER_URL
from src.db import configure_db

app = Flask(__name__)

#register blueprints that responsible to structure endpoints
app.register_blueprint(currency_api, url_prefix="/api")
app.register_blueprint(swagger_ui, url_prefix=SWAGGER_URL)

#call method to init the configure db
configure_db(app)

#register swagger all swagger functions 
with app.test_request_context():
    for function_name in app.view_functions:
        if function_name == 'static':
            continue
        view_function = app.view_functions[function_name]
        apispec.path(view=view_function)


@app.route("/")
def index():
    return render_template("index.html")

#endpoint to load swagger docs
@app.route("/api/swagger.json")
def swagger_spec():
    return jsonify(apispec.to_dict())