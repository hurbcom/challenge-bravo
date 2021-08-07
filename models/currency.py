from flask_login import UserMixin
from dataclasses import dataclass
from database.sharedConnector import db
import json
from flask import jsonify

# from flask_sqlalchemy import declarative_base
# # from flask.ext.jsontools import JsonSerializableBase
# from flask_jsontools import JsonSerializableBase



# Base = declarative_base(cls=(JsonSerializableBase,))

@dataclass
class Currency(db.Model):
    # this is important to the decorator @dataclass that serializes data from db (fectch object from orm) - Rafael
    code: str
    in_usd: float

    __tablename__ = 'currency'

    code = db.Column(db.String(),  primary_key=True, nullable=False)
    in_usd = db.Column(db.Float(), nullable=False)
    created_on = db.Column(db.DateTime, server_default=db.func.now())
    updated_on = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def save(self):
        db.session.add(self)
        db.session.commit()

    def getAllCustomCurrenciesCodes():
        allCustomCurrencies = db.session.query(Currency.code).all()
        res = Currency.query.with_entities(Currency.code).all()
        # allCustomCurrencies = jsonify(allCustomCurrencies)

        # if 'HRB' not in allCustomCurrencies:
        #     print('MIGA SUA LOKA')
        # else:
        #     print('OMG')


