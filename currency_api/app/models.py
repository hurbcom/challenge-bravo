from . import db

class Currency(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(3), unique=True, nullable=False)
    name = db.Column(db.String(50), unique=True, nullable=False)
    rate_to_usd = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Currency {self.code}>'

