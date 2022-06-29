import os

from app import routes
from app.classes.app_with_db import AppWithDb
from app.configs import config_selector, database, migrations


def create_app() -> AppWithDb:
    app = AppWithDb(__name__)

    config_type = os.getenv("FLASK_ENV", "production")

    app.config.from_object(config_selector[config_type])

    database.init_app(app)
    migrations.init_app(app)
    routes.init_app(app)

    return app
