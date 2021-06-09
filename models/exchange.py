from sql_alchemy import banco


class ExchangeModel(banco.Model):
    __tablename__ = 'exchange'

    id = banco.Column(banco.Integer, primary_key=True)
    name = banco.Column(banco.String(50))
    value = banco.Column(banco.Float(precision=6), nullable=True)

    def __init__(self, name, value):
        self.id
        self.name = name
        self.value = value

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'value': self.value
        }

    @classmethod
    def find_currency_by_id(cls, id):
        currency = cls.query.filter_by(id=id).first()
        if currency:
            return currency
        return None

    @classmethod
    def find_currency_by_name(cls, name):
        currency = cls.query.filter_by(name=name).first()
        if currency:
            return currency
        return None

    def save_exchange(self):
        banco.session.add(self)
        banco.session.commit()

    def update_exchange(self, name, value):
        self.name = name
        self.value = value

    def delete_exchange(self):
        banco.session.delete(self)
        banco.session.commit()
