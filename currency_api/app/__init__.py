from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    with app.app_context():
        db.init_app(app)
        from .models import Currency 

        from .routes import bp as api_bp
        app.register_blueprint(api_bp)

        db.create_all()

    return app