from django.db import models

# Create your models here.
class Currency(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    symbolAlias = models.CharField(max_length=10, null = False, unique=True)
    nameDescription = models.CharField(max_length=255, null = False)
    baseUsdValue = models.DecimalField(max_digits=10,decimal_places=4, null = False)
    _typeCurrency = [
        (1, 'REAL'),
        (2, 'VIRTUAL'),
    ]
    typeCurrency = models.CharField(
        max_length=2,
        choices=_typeCurrency,
        default=1,
    )
    lastUpdateDate = models.DateTimeField(auto_now_add=True)
    quotationDate = models.DateTimeField(auto_now_add=True)
