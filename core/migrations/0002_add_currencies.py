from django.db import migrations


def add_currencies(apps, schema_editor):
    Currency = apps.get_model('core', 'Currency')
    symbols = (
        ('USD', True),
        ('BRL', False),
        ('EUR', False),
        ('BTC', False),
        ('ETH', False),
    )
    for symbol, is_base in symbols:
        Currency.objects.create(
            symbol=symbol,
            is_base=is_base,
            value=1,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_currencies),
    ]
