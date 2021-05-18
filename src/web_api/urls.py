from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flasgger import Swagger
import os
from src.web_api.routes.root import Root
from src.web_api.routes.version import Version
from src.web_api.routes.currency import Currency, CurrencyConverter


class Urls:
    def __init__(self, application):
        self.hurby = application
        self.server = Flask(__name__)
        self.server.config["SWAGGER"] = {
            'title': f'HURBy {os.getenv("FLASK_ENV", "")}',
            'version': 1,
            'description': "HURBy Endpoints"
        }
        self.web_api = Api(self.server)

        # Swagger Configuration
        swagger = Swagger(self.server, template_file='../../src/swagger/template.yml')

        # Add routes
        self.add_routes(web_api=self.web_api)

        # Enable CORS
        CORS(self.server)

    def add_routes(self, web_api):
        web_api.add_resource(Root, "/", endpoint='/')
        web_api.add_resource(Version, "/hurby/version", endpoint='hurby/version',
                             resource_class_kwargs={"config": self.hurby.config})
        web_api.add_resource(Currency, "/hurby/currency", endpoint='hurby/currency',
                             resource_class_kwargs={"hurby": self.hurby})
        web_api.add_resource(CurrencyConverter, "/hurby/currency/converter", endpoint='hurby/currency/converter',
                             resource_class_kwargs={"hurby": self.hurby})

    def run(self):
        self.server.run(
            host=self.hurby.config.FLASK_HOST,
            port=self.hurby.config.FLASK_PORT,
            debug=self.hurby.config.DEBUG_MODE
        )
