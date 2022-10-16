from http import HTTPStatus
from urllib import parse

import requests
from django.conf import settings
from django.forms import CharField
from django.forms import ChoiceField
from django.forms import FloatField
from django.forms import Form
from django.forms import Select
from django.forms import TextInput
from django.forms import NumberInput


def get_fictional_currencies():
    endpoint = f'/api/fictional-currencies/'
    url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)
    response = requests.get(url)

    if response.status_code != HTTPStatus.OK:
        return []

    return [
        (currency['currency_short_name'], currency['currency_short_name'])
        for currency in response.json()
    ]


def get_official_currencies():
    endpoint = f'/api/official-currencies/'
    url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)
    response = requests.get(url)

    if response.status_code != HTTPStatus.OK:
        return []

    return [
        (currency['currency_short_name'], currency['currency_short_name'])
        for currency in response.json()
    ]


def get_all_currencies():
    return sorted(
        get_official_currencies() + get_fictional_currencies(), key=lambda t: t[0]
    )


class ConverterCurrencyForm(Form):
    amount = FloatField(
        initial=0,
        label='Valor a converter *',
        min_value=0,
        widget=NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
    )

    currency_from = ChoiceField(
        choices=get_all_currencies,
        label='Moeda de origem *',
        widget=Select(attrs={'class': 'form-control'})
    )

    currency_to = ChoiceField(
        choices=get_all_currencies,
        label='Moeda de destino *',
        widget=Select(attrs={'class': 'form-control'})
    )

    def __init__(self, token: str = None, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        super().__init__(*args, **kwargs)


class FictionalCurrencyForm(Form):
    currency_amount = FloatField(
        label='Valor da moeda *',
        min_value=0,
        widget=NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
    )

    currency_backing = ChoiceField(
        choices=get_official_currencies,
        label='Moeda de Lastro *',
        widget=Select(attrs={'class': 'form-control'})
    )

    currency_short_name = CharField(
        label='Nome da Moeda *', max_length=3, widget=TextInput(attrs={'class': 'form-control'})
    )

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        super().__init__(*args, **kwargs)
