from django.db import models

class Moedas(models.Model):
    simbolo = models.CharField(max_length=5)
    nome = models.CharField(max_length=255)
    cotacao = models.DecimalField(max_digits=10, decimal_places=2)
    ultima_atualizacao = models.DateTimeField(null=True, blank=True)

