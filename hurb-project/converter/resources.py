# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from tastypie.resources import ModelResource
from converter.models import Currency
from tastypie.authorization import Authorization
from django.conf.urls import url
from tastypie.utils import trailing_slash
from converter.connector import ExternalApiConnector
from converter.utils import conversion_calculate, verify_if_exists_symbols
from django.core.exceptions import ValidationError


# Create your views here.


class CurrencyResource(ModelResource):
    class Meta:
        queryset = Currency.objects.all()
        resource_name = 'currency'
        authorization = Authorization()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/convert_value%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('convert_value'), name="api_teste"),
        ]


    def obj_create(self, bundle, request=None, **kwargs):

        symbol = bundle.data.get('symbol')
        description = bundle.data.get('description')

        if not (symbol and description):
            raise ValidationError(message='Não é possível cadastrar uma moeda sem um símbolo ou uma descrição.')

        if Currency.objects.filter(symbol=symbol):
            raise ValidationError(message='Não é possível cadastrar uma moeda com símbolo repetido.')

        bundle = super(CurrencyResource, self).obj_create(bundle, request=bundle.request, **kwargs)
        return bundle



    def convert_value(self, request, **kwargs):
        self.method_check(request, allowed=['post'])



        currency_from = request.GET.get('from')
        currency_to = request.GET.get('to')
        if currency_to == currency_from:
            raise ValidationError(message='Foram inseridos dois campos iguais para conversão.')
    
        is_valid_entry = verify_if_exists_symbols(currency_from, currency_to)

        if not is_valid_entry:
            raise ValidationError("O simbolo fornecido não foi encontrado. É necessário cadastra-lo antes.")

            #return self.create_response(request, {"error_message": "O símbolo fornecido não está cadastrado. É necessário cadastra-lo anteriormente."}, 404)


        amount = float(request.GET.get('amount'))
        if amount < 0:
            raise ValidationError("O valor da conversão não pode ser negativo.")

        response_json = ExternalApiConnector.get_quotation(self, currency_from, currency_to)
    
        value_to = response_json[currency_from][currency_to]
        total = conversion_calculate(value_to, amount)


        response_json['total'] = total



        return self.create_response(request, response_json)
