from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.forms.widgets import TextInput

from backend.services import ApiCoin, Convert
from .models import MyCoin


def get_coins():
    apicoin = ApiCoin()
    currencies = apicoin.get_currencies()
    currencies = [(k, v['currencyName']) for k, v in currencies.items()]

    mycoin = MyCoin.objects.all()
    for coin in mycoin:
        currencies.append((coin.codecoin, coin.namecoin))

    currencies = tuple(currencies)
    return sorted(currencies, key=lambda col: col[1])


def get_value_converter(from_coin, to_coin, amount):
    convert = Convert(from_coin=from_coin, to_coin=to_coin, amount=amount)
    # Returns the already converted value
    value_convert = convert.set_convert()
    return value_convert


class ConverterForm(forms.Form):

    from_coin = forms.ChoiceField(
        label=_('From Currency'),
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        )
    )
    to_coin = forms.ChoiceField(
        label=_('To Currency'),
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        )
    )
    amount = forms.FloatField(
        label=_('Value'),
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        )
    )
    value_converter = forms.FloatField(
        label=_('Converted Value'),
        required=False,
        widget=forms.TextInput(
            attrs={
                'readonly': 'readonly',
                'class': 'form-control'
            }
        )
    )

    def __init__(self, *args, **kwargs):
        super(ConverterForm, self).__init__(*args, **kwargs)

        self.fields['from_coin'].choices = get_coins()
        self.fields['to_coin'].choices = self.fields['from_coin'].choices

        if self.is_bound:
            self.data = self.data.copy()
            from_coin = self.data['from_coin']
            to_coin = self.data['to_coin']
            amount = float(
                self.data['amount'] if self.data['amount'] != '' else '0'
            )

            if amount > 0:
                self.data['value_converter'] = get_value_converter(
                    from_coin, to_coin, amount
                )

    def clean(self):
        self.cleaned_data = super().clean()

        if not self.cleaned_data.get('amount') or \
                self.cleaned_data.get('amount') <= 0:
            raise ValidationError(_('Please enter a valid value.'))


class MyCoinModelForm(forms.ModelForm):
    price = forms.FloatField(
        label=_('Value in USD'),
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        )
    )

    class Meta:
        model = MyCoin
        fields = ('codecoin', 'namecoin', 'price')
        widgets = {
            'codecoin': TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),
            'namecoin': TextInput(
                attrs={
                    'class': 'form-control'
                }
            ),
        }

    def clean_price(self):
        price = self.cleaned_data['price']
        if price < 1:
            raise ValidationError(_('Please enter a valid value.'))

        return price
