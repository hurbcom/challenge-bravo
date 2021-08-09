from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from project.settings import HOST, PORT, DEBUG
from routes.auth import authRoutes
from routes.currency import currencyRoutes
from database.sharedConnector import db
from models.currency import Currency
import os

api = Flask(__name__)
api.name = 'HURB Converter v1.0'
api.secret_key =  os.getenv('SECRET_KEY')
api.flask_run_port = PORT
api.flask_run_HOST = HOST
api.debug = DEBUG
api.threaded = True
CORS(api)
authManager = LoginManager(api)
authRoutes(api, authManager)
currencyRoutes(api)

api.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///database/{os.getenv('DB_NAME')}"
api.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(api)


with api.app_context():
    Currency.__table__.create(db.session.bind, checkfirst=True)
    db.create_all()
