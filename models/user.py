from flask_login import UserMixin
from database.sharedConnector import db


class User(db.Model):

    __tablename__ = 'user'

    def __init__(self, **kwargs):
        self.authenticated = False
        super(User, self).__init__(**kwargs)


    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), nullable=False)
    password = db.Column(db.TEXT(), nullable=False)
    is_active = db.Column(db.Boolean(), default=False)
    created_on = db.Column(db.DateTime, server_default=db.func.now())
    updated_on = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def is_authenticated(self):
        return self.authenticated

    def get_id(self):
        return self.id
