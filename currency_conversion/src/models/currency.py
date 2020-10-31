#--- Define Currency model to Database --#
from src.db import db

#Class to represents currency model 
class Currency(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    currency_code = db.Column(db.String(3), nullable=False)

    def __init__(self, currency_code):
        self.currency_code = currency_code

