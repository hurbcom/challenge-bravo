from sqlalchemy.orm import Session

from app.models import CurrenciesCoinsbaseModel
from app.schemas.converter import OutputConversionSchema
from app.services.currencies import CurrencyService


class ConvertOperator:
    def __init__(self, from_: str, to: str, amount: float, db: Session) -> None:
        self.from_ = CurrencyService(currency_code=from_).read(db=db)
        self.to = CurrencyService(currency_code=to).read(db=db)
        self.amount = amount
        self.db = db

    def _convert_to_usd(self, currency: CurrenciesCoinsbaseModel) -> None:
        if currency.backed_by != "USD":
            backed_currency = CurrencyService(currency_code=currency.backed_by).read(
                db=self.db
            )
            currency.rate = currency.rate * backed_currency.rate
            currency.backed_by = "USD"

    def convert_currencies(self) -> OutputConversionSchema:
        if self.from_.backed_by != self.to.backed_by:
            self._convert_to_usd(currency=self.from_)
            self._convert_to_usd(currency=self.to)

        amount_in_usd = self.amount / self.from_.rate
        converted_value = amount_in_usd * self.to.rate

        return OutputConversionSchema(
            from_=self.from_.currency_code,
            to=self.to.currency_code,
            amount=self.amount,
            converted_value=round(converted_value, 2),
            updated_at=self.from_.updated_at,
        )
