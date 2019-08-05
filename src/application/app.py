from flask import Flask, Blueprint
from src.application import settings

from src.application.api.conversion.endpoints.convert import ns as convert_namespace
from src.application.api.restplus import api

app = Flask(__name__)

def configure_app(flask_app):
    flask_app.config['SERVER_NAME'] = settings.FLASK_SERVER_NAME
    flask_app.config['SWAGGER_UI_DOC_EXPANSION'] = settings.RESTPLUS_SWAGGER_UI_DOC_EXPANSION
    flask_app.config['RESTPLUS_MASK_SWAGGER'] = settings.RESTPLUS_MASK_SWAGGER
    flask_app.config['ERROR_404_HELP'] = settings.RESTPLUS_ERROR_404_HELP

def initialize_app(flask_app):
    configure_app(flask_app)

    blueprint = Blueprint('api', __name__, url_prefix='/api')
    api.init_app(blueprint)
    api.add_namespace(convert_namespace)
    flask_app.register_blueprint(blueprint)

def main():
    initialize_app(app)
    app.run(debug=settings.FLASK_DEBUG)

main()
