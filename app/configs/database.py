from flask_sqlalchemy import SQLAlchemy

from app.classes.app_with_db import AppWithDb

db = SQLAlchemy()


def init_app(app: AppWithDb) -> None:
    """Estabelece a conexão com o banco de dados."""

    db.init_app(app)
    app.db = db

    # Model imports
    # from app.models import (

    # )
