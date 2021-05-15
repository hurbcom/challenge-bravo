from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from waitress import serve
from src.web_api.routes.root import Root
from src.web_api.routes.version import Version


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

        # Add routes
        self.add_routes(web_api=self.web_api)

        # Enable CORS
        CORS(self.server)

    def add_routes(self, web_api):
        web_api.add_resource(Root, "/", endpoint='/')
        web_api.add_resource(Version, "/huby/version", endpoint='huby/version',
                             resource_class_kwargs={"config": self.huby.config})

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
