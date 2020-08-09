from models.currency import Currency

class DatabaseOperations():
    def populate_db():
        print("Trying to populate Database")
        c = Currency()

        c.create({"symbol":"BRL"})
        c.create({"symbol":"BTC"})
        c.create({"symbol":"USD"})
        c.create({"symbol":"ETH"})
        c.create({"symbol":"EUR"})

