import requests
from urllib import parse

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.views import View

from dashboard.forms import ConverterCurrencyForm
from dashboard.forms import FictionalCurrencyForm


class ConvertCurrency(View):
    def post(self, request):
        endpoint = f'/api/convert/'
        url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)

        params = {
            'amount': request.POST.get('currency_amount'),
            'from': request.POST.get('currency_from'),
            'to': request.POST.get('currency_to'),
        }
        response = requests.get(url, params=params)

        return JsonResponse(response.json(), safe=False)


class FictionalCurrencies(View):
    template_name = 'currency/convert-currency.html'

    def get(self, request):
        endpoint = f'/api/fictional-currencies/'
        url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)

        response = requests.get(url)

        return render(
            request,
            self.template_name,
            {'currencies': response.json(), 'converter_form': ConverterCurrencyForm()}
        )


class FictionalCurrencyAdd(View):
    template_name = 'currency/fictional-currency-form.html'

    def get(self, request):
        return render(request, self.template_name, {'form': FictionalCurrencyForm()})

    def post(self, request):
        form = FictionalCurrencyForm(data=request.POST)

        if not form.is_valid():
            return redirect('dashboard:currencies')

        endpoint = f'/api/fictional-currency/'
        url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)

        requests.post(url, data=request.POST)

        return redirect('dashboard:currencies')


class FictionalCurrencyEdit(View):
    template_name = 'currency/fictional-currency-form.html'

    def get(self, request, currency_short_name: str):
        endpoint = f'/api/fictional-currency/{currency_short_name}/'
        url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)

        response = requests.get(url)

        return render(
            request, self.template_name, {'form': FictionalCurrencyForm(data=response.json())}
        )

    def post(self, request, currency_short_name: str):
        form = FictionalCurrencyForm(data=request.POST)

        if not form.is_valid():
            return redirect('dashboard:currencies')

        currency_data = request.POST.dict()
        currency_data.pop('csrfmiddlewaretoken')

        endpoint = f'/api/fictional-currency/{currency_short_name}/'
        url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)

        requests.put(url, data=currency_data)

        return redirect('dashboard:currencies')


class FictionalCurrencyRemove(View):
    def post(self, request):
        if not (currency_short_name := request.POST.get('currency_short_name')):
            return redirect('dashboard:currencies')

        endpoint = f'/api/fictional-currency/{currency_short_name}/'
        url = parse.urljoin(settings.CURRENCY_API_URL, endpoint)

        requests.delete(url)

        return redirect('dashboard:currencies')
