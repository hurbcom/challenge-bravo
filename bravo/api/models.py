from django.db import models

class Moedas(models.Model):
    simbolo = models.CharField(max_length=15, unique=True)

class Cotacao(models.Model):
    moeda_para = models.ForeignKey('Moedas',on_delete=models.CASCADE, related_name='moeda_para')
    moeda_de = models.ForeignKey('Moedas',on_delete=models.CASCADE, related_name='moeda_de')
    ultima_atualizacao = models.DateField(null=True, blank=True)
    cotacao = models.DecimalField(max_digits=10, decimal_places=2)