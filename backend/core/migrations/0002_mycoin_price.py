# Generated by Django 3.2.6 on 2021-08-12 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mycoin',
            name='price',
            field=models.FloatField(default=0, verbose_name='Price Coin'),
        ),
    ]
