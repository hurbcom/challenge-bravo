from config import db


class ExchangeRate(db.Model):
    __tablename__ = "google-currency-information"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    symbol = db.Column(
        db.String(10),
        nullable=False,
    )

    rate = db.Column(
        db.Float(),
        nullable=False
    )

    available = db.Column(
        db.Boolean()
    )

    last_update = db.Column(
        db.String(100)
    )

    def __init__(self, symbol, rate, available, last_update):
        self.symbol = symbol
        self.rate = rate
        self.available = available
        self.last_update = last_update