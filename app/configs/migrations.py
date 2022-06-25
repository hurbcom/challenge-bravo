from flask_migrate import Migrate

from app.classes.app_with_db import AppWithDb


def init_app(app: AppWithDb) -> None:
    ''' Inicializa as migrations. '''
    Migrate(app=app, db=app.db, compare_type=True)
