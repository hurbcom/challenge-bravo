from django.core.management.base import BaseCommand
from django.utils import timezone
from converter.models import *
class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        initial_countries = ['BRL', 'USD', 'EUR', 'BTC', 'ETH']
        currencies_qs = Currency.objects.all()
        for country in initial_countries:
            if not currencies_qs.filter(symbol=country):
                Currency.objects.create(symbol=country, description="Moeda do pais " + country)
        print("Terminando o command")