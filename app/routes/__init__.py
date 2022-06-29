from flask import Flask

from app.routes.currency_blueprint import bp_currency


def init_app(app: Flask) -> None:
    """Registra as blueprints"""

    app.register_blueprint(bp_currency, url_prefix="/api")
