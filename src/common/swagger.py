from flasgger import Swagger


def configure_swagger(flask_app):
    swagger_config = {
        "openapi": "3.0.2",
        "title": "bravo-api",
        "description": "Bravo API for currency registering and conversion calculation",
        "version": "0.0.1",
        "hide_top_bar": True,
        "termsOfService": "",
        "components": {},
    }
    flask_app.config["SWAGGER"] = swagger_config
    Swagger(flask_app)
