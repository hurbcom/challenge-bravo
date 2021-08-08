from django.db import models


class Currency(models.Model):
    """
    Classe que define o modelo de Currency (moeda)
    """

    iso_code = models.CharField(max_length=5, primary_key=True)
    name = models.CharField(max_length=50)
    territory = models.CharField(max_length=50)

    def __str__(self):
        return self.iso_code


class CurrencyExchange(models.Model):
    """
    Classe que define o modelo da relação de valores do câmbio entre moedas na proporção de 1->x
    ou seja, 1 iso_code_from para x iso_code_to.
    Por exemplo:
        (iso_code_from = USD, iso_code_to = USD, exchange_rate = 1)
        (iso_code_from = BRL, iso_code_to = BRL, exchange_rate = 1)
        (iso_code_from = USD, iso_code_to = BRL, exchange_rate = 5.25)
        (iso_code_from = BTC, iso_code_to = USD, exchange_rate = 40895.80)
        ...
    """

    iso_code_from = models.ForeignKey(Currency, related_name="currency_from", on_delete=models.CASCADE)
    iso_code_to = models.ForeignKey(Currency, related_name="currency_to", on_delete=models.CASCADE)
    exchange_rate = models.FloatField(null=False, default=None)

    def __str__(self):
        return f'{self.iso_code_from} 1.00 = {self.iso_code_to} {self.exchange_rate}'
