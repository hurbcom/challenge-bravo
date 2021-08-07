from flask_login import UserMixin
from dataclasses import dataclass
from database.sharedConnector import db
import json
from flask import jsonify


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


