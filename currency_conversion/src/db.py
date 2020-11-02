#-- Setup file to database (with SQLAlchemy) --#

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

#define constants for SQLAlchemy db and Marshmallow(for Schemas)
db = SQLAlchemy()
marsh = Marshmallow()

#method to create setup for db and init de marshmallow schemas
def configure_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///currency_converse.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    marsh.init_app(app)
    db.create_all(app=app)    

