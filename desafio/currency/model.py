from desafio.extensions import db


class Currency(db.Model):  # type: ignore
    id: int = db.Column(db.Integer, primary_key=True)
    simbol_currency: str = db.Column(db.String(6), unique=True, nullable=False)
    name_description: str = db.Column(db.String(30), nullable=False)

    def __init__(self, simbol_currency="", name_description=""):
        self.simbol_currency = simbol_currency
        self.name_description = name_description

    def __repr__(self):
        return '<Currency %r>' % self.name_description

    def __eq__(self, other_user):
        if self.name_description == other_user.name_description and \
                self.simbol_currency == other_user.simbol_currency:
            return True
        else:
            return False
