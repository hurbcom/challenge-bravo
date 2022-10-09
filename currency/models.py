from decimal import Decimal

from django.db.models import CharField
from django.db.models import DateTimeField
from django.db.models import DecimalField
from django.db.models import Model


class FictionalCurrency(Model):
    currency_backing = CharField('Moeda de Lastro', max_length=10)

    created_at = DateTimeField('Data de Criação', auto_now_add=True)

    currency_amount = DecimalField(
        'Valor da Moeda',
        decimal_places=2,
        default=Decimal(0),
        max_digits=10,
    )

    currency_short_name = CharField('Nome da Moeda Abreviado', max_length=10, unique=True)

    updated_at = DateTimeField('Data de Atualização', auto_now=True)

    class Meta:
        verbose_name = 'Moeda Fictícia'
        verbose_name_plural = 'Moedas Fictícias'

    def __str__(self) -> str:
        return self.currency_short_name
