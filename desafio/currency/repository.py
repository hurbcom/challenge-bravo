from desafio.currency.model import Currency
from desafio.extensions import session_scope


class CurrencyRepository():

    def get_all_currency(self):
        with session_scope() as session:
            return session.query(Currency).all()

    def get_currency_by_simbol_currency(self, currency):
        with session_scope() as session:
            currency = session.query(Currency).filter(
                Currency.simbol_currency == currency.simbol_currency).first()
        return currency

    def get_currency_by_id(self, currency):
        with session_scope() as session:
            currency = session.query(Currency).filter(
                Currency.id == currency.id).first()
        return currency

    def insert(self, currency):
        with session_scope() as session:
            session.add(currency)
            currency = session.query(Currency).filter(
                Currency.simbol_currency == currency.simbol_currency).first()
            print('Insert', currency)
            return currency.id

    def update(self, currency):
        with session_scope() as session:
            session.query(Currency).filter(
                Currency.id == currency.id).update(
                    {"simbol_currency": currency.simbol_currency,
                     "name_description": currency.name_description}
            )
            update_currency = session.query(Currency).filter(
                Currency.simbol_currency == currency.simbol_currency).first()
        return update_currency

    def delete(self, currency):
        with session_scope() as session:
            currency = session.query(Currency).filter(
                currency.simbol_currency == currency.simbol_currency).first()
            session.delete(currency)
            currency = session.query(Currency).filter(
                currency.simbol_currency == currency.simbol_currency).first()
        return currency is None
