from decimal import Decimal

from django.db.models import CharField
from django.db.models import DateTimeField
from django.db.models import DecimalField
from django.db.models import Model

from currency.errors import CurrencyUnknownError
from currency.utils.constants import CURRENCIES_CHOICES
from currency.utils.constants import OFFICIAL_CURRENCIES


class FictionalCurrency(Model):
    currency_backing = CharField('Moeda de Lastro', choices=CURRENCIES_CHOICES, max_length=3)

    created_at = DateTimeField('Data de Criação', auto_now_add=True)

    currency_amount = DecimalField(
        'Valor da Moeda',
        decimal_places=2,
        default=Decimal(0),
        max_digits=10,
    )

    currency_short_name = CharField('Nome da Moeda Abreviado', max_length=3, unique=True)

    updated_at = DateTimeField('Data de Atualização', auto_now=True)

    class Meta:
        verbose_name = 'Moeda Fictícia'
        verbose_name_plural = 'Moedas Fictícias'

    def __str__(self) -> str:
        return self.currency_short_name

    @staticmethod
    def get_currency_base_data(currency_name: str) -> dict:
        """Get currency base data.

        Args:
            currency_name (str): Currency name

        Raises:
            CurrencyUnknownError: raised if currency_name is not official nor fictional

        Returns:
            A dictionary containing the base structure that a currency must have within the system
        """
        if currency_name in OFFICIAL_CURRENCIES:
            return {
                'currency_amount': 1.0,
                'currency_backing': currency_name,
                'currency_name': currency_name,
                'is_fictional': False,
            }

        # NOTE (@gustavo): When it is a real currency, the currency_backing will be the currency
        #                  itself
        try:
            currency = FictionalCurrency.objects.get(currency_short_name=currency_name)
        except FictionalCurrency.DoesNotExist:
            raise CurrencyUnknownError('Currency is not official neither is a fictional')

        return {
            'currency_amount': float(currency.currency_amount),
            'currency_backing': currency.currency_backing,
            'currency_name': currency_name,
            'is_fictional': True,
        }


class OfficialCurrency:
    @staticmethod
    def all():
        """Get all official currencies and add in a normalized data structure.

        Returns:
            A list of dictionaries containing the data of official currencies.
        """
        return [
            {
                'currency_short_name': currency,
                'currency_backing': currency,
                'currency_amount': 1.0,
            }
            for currency in OFFICIAL_CURRENCIES
        ]
