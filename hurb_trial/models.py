from tortoise.models import Model
from tortoise.fields import CharField, IntField, FloatField
from tortoise.fields.data import DatetimeField


class CustomCurrency(Model):
    id = IntField(pk=True)
    name = CharField(max_length=50, unique=True)
    code = CharField(max_length=5, unique=True)
    value = FloatField(
        null=False,
        default=0,
        unique=False,
        description="Value of currency compared to USD value",
    )
    created_at = DatetimeField(auto_now_add=True)
    updated_at = DatetimeField(auto_now=True)
