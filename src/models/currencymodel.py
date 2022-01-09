from server.server import *

db = server.database.getDb()

class Currency(db.Model):
    name = db.Column(db.String,primary_key=True)
    value = db.Column(db.Float)
    last_update = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    access_count = db.Column(db.Integer, default=0)

    def __init__(self,name,value):
        self.name = name
        self.value = value

    def __repr__(self):
        return 'Moeda: %s - Valor: %s - Ultima Atualizacao: %s' % self.name, self.value, self.last_update

    def get(name):
        with server.app_context():
            currency = Currency.query.get(name)
            currency.access_count += 1
            db.session.refresh(currency)
            return currency

    def exists(name):
        with server.app_context():
            currency = Currency.query.get(name)
            return currency != None

    def save(self):
        with server.app_context():
            db.session.add(self)
            db.session.commit()

    def update(name,value):
        with server.app_context():
            currency = Currency.query.get(name)
            currency.value = value
            currency.access_count += 1
            currency.save()

    def updateIntern(name,value):
        with server.app_context():
            currency = Currency.query.get(name)
            currency.value = value
            currency.save()

    def remove(self):
        with server.app_context():
            db.session.delete(self)
            db.session.commit()