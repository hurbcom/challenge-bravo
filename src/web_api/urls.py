from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flasgger import Swagger
from waitress import serve
from src.web_api.routes.root import Root
from src.web_api.routes.version import Version
from src.web_api.routes.currencies import CurrenciesConverter


class Urls:
    def __init__(self, application):
        self.huby = application
        self.server = Flask(__name__)
        self.server.config["SWAGGER"] = {
            'title': "HUBy",
            'version': 1,
            'description': "HUBy Endpoints"
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
        web_api.add_resource(Version, "/huby/version", endpoint='huby/version',
                             resource_class_kwargs={"config": self.huby.config})
        web_api.add_resource(CurrenciesConverter, "/huby/currencies/converter", endpoint='huby/currencies/converter',
                             resource_class_kwargs={"huby": self.huby})

    def run(self):
        if self.huby.config.DEBUG_MODE:
            # run application in debug mode
            self.server.run(
                host=self.huby.config.FLASK_HOST,
                port=self.huby.config.FLASK_PORT,
                debug=self.huby.config.DEBUG_MODE
            )
        else:
            # run application in production
            serve(self.server, host=self.huby.config.FLASK_HOST, port=self.huby.config.FLASK_PORT)
