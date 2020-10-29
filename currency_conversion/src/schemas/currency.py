#--- Define schema for bind Currency object ---#
from src.db import marsh

class CurrencySchema(marsh.Schema):
    class Meta:
        fields = ('id','currency_code')