from sqlalchemy.orm import Session

from app.operators.currency import CurrencyOperator
from app.models import OficialCoin
from app.schemas.convert import ConversionOut



class ConvertOperator:
    """ Handle the conversion operation between two currencies """

    def __init__(self, source: str, target: str, amount: float, db: Session) -> None:
        self.source = CurrencyOperator(currency_code=source).read(db=db)
        self.target = CurrencyOperator(currency_code=target).read(db=db)
        self.amount = amount
        self.db = db


    def _convert_to_usd(self, currency: OficialCoin) -> None:
        """ Convert currency to USD """

        if currency.backed_by != "USD":
            backed_currency = CurrencyOperator(currency_code=currency.backed_by).read(db=self.db)
            currency.rate = currency.rate * backed_currency.rate
            currency.backed_by = "USD"
        return


    def convert(self) -> ConversionOut:
        """ Convert two currencies """

        # In case of different backed_by currencies, convert them to USD first
        if self.source.backed_by != self.target.backed_by:
            self._convert_to_usd(currency=self.source)
            self._convert_to_usd(currency=self.target)

        amount_in_usd = self.amount / self.source.rate
        converted_amount = amount_in_usd * self.target.rate

        conversion_result = ConversionOut(
            source=self.source.currency_code,
            target=self.target.currency_code,
            amount=self.amount,
            converted_amount=round(converted_amount, 2),
            updated_at=self.source.updated_at
        )

        return conversion_result