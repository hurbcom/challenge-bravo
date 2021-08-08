# from django.shortcuts import render

from rest_framework import viewsets, generics
from rest_framework.response import Response

from django.db.models.query import QuerySet

from .adapters import ConsultOpenExchangeRatesAdapter
from .dtos import CalculateCurrencyExchangeDto
from .models import Currency, CurrencyExchange
from .serializers import (
    CurrencySerializer, CurrencyExchangeSerializer,
    CalculateCurrencyExchangeDtoSerializer, CalculateCurrencyExchangeRequestSerializer
)


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all().order_by('iso_code')
    serializer_class = CurrencySerializer


class CurrencyExchangeViewSet(viewsets.ModelViewSet):
    queryset = CurrencyExchange.objects.all().order_by('iso_code_from')
    serializer_class = CurrencyExchangeSerializer


# class CalculateCurrencyAmountView(generics.ListAPIView):
class CalculateCurrencyAmountView(viewsets.ViewSet):

    serializer_class = CalculateCurrencyExchangeRequestSerializer

    def get(self, request, *args, **kwargs):

        if not kwargs:
            kwargs = request.GET.dict()

        if not kwargs:
            response = {"from": "Campo obrigatório", "to": "Campo obrigatório", "amount":  "Campo obrigatório"}
            return Response(response)

        # Monta o DTO da requisição
        dto = self._build_dto_from_validated_request_data(request_data=kwargs)

        # Checa no DB se as moedas existem
        model_currency_from = self.get_currency_on_db(iso_code=dto.currency_from)
        model_currency_to = self.get_currency_on_db(iso_code=dto.currency_to)

        if not model_currency_from:
            response = {
              "error": True, "status": 404, "message": f"Moeda não encontrada. ({dto.currency_from})",
              "description":
              f"Cadastre-a em nossa base juntamente com sua taxa de câmbio para futuras pesquisas e comparações."
            }
            return Response(response, status=404)

        if not model_currency_to:
            response = {
              "error": True, "status": 404, "message": f"Moeda não encontrada. ({dto.currency_to})",
              "description":
              f"Cadastre-a em nossa base juntamente com sua taxa de câmbio para futuras pesquisas e comparações."
            }
            return Response(response, status=404)

        # Pega a taxa de câmbio do banco, caso exista
        exchange_rate = self.get_currency_exchange_rate_on_db(dto, model_currency_from, model_currency_to)

        if exchange_rate:
            dto.exchange_rate = exchange_rate
            exchange_value = self.calculate_exchange_value(dto)
            dto.exchange_value = exchange_value

            # Retorna o DTO com o valor de troca do câmbio calculado
            return Response(dto.asdict())

        # Caso a taxa de câmbio não exista no banco nem na API
        # Pesquisa se existe a correlação inversa, se existir, calcula a correlação de câmbio requisitada
        # Por exemplo:
        #   se não existe no DB a correlação (BRL 1 = USD ? -> verificada acima),
        #   mas existe a correlação (USD 1 = BRL 5.25 -> verificada abaixo com inverse_dto)
        #   calcula a correlação (BRL 1 = USD ?), salva no DB, calcula o exchange_value e
        #   retorna o resultado

        inverse_dto = CalculateCurrencyExchangeDto(
            currency_from=dto.currency_to, currency_to=dto.currency_from,
            exchange_rate=0.0, amount=dto.amount,
            exchange_value=0.0
        )

        inverse_exchange_rate = self.get_currency_exchange_rate_on_db(
            dto=inverse_dto, model_currency_from=model_currency_to, model_currency_to=model_currency_from
        )

        if inverse_exchange_rate:
            inverse_dto.exchange_rate = inverse_exchange_rate

            exchange_rate = self.calculate_exchange_rate_based_on_inverse_dto(inverse_dto)
            dto.exchange_rate = exchange_rate

            # Salva novo exchange_rate
            currency_exchange = CurrencyExchange(
                iso_code_from=model_currency_from,
                iso_code_to=model_currency_to,
                exchange_rate=dto.exchange_rate
            )

            currency_exchange.save()

            exchange_value = self.calculate_exchange_value(dto)
            dto.exchange_value = exchange_value

            # Retorna o DTO com o valor de troca do câmbio calculado
            return Response(dto)

        response = {
            "error": True, "status": 404,
            "message": f"Relação de câmbio entre moedas não foi encontrada. ({dto.currency_from}->{dto.currency_to})",
            "description": f"Cadastre a taxa de câmbio para futuras pesquisas e comparações."
        }
        return Response(response, status=404)

    @staticmethod
    def get_currency_on_db(iso_code):
        """
        Método que pesquisa no banco de dados se a moeda já foi cadastrada,
        se a moeda existir, retorna o modelo de Currency.
        se não, pesquisa em uma API externa se a moeda existe,
        se a moeda existir, cadastra a moeda no DB e retorna o modelo de Currency.
        se não, retorna False.

        :param iso_code: str
        :return: Currency | False
        """
        try:
            currency = Currency.objects.get(iso_code=iso_code)
        except Currency.DoesNotExist as err:
            print(err)
            currency = False

        if not currency:
            currency_adapter = ConsultOpenExchangeRatesAdapter()
            try:
                currency_dict = currency_adapter.currency_dict[iso_code]
                currency = Currency(
                    iso_code=currency_dict["iso_code"],
                    name=currency_dict["name"],
                    territory=currency_dict["territory"]
                )
                currency.save()
            except Exception as err:
                print(err)
                currency = False

        return currency

    @staticmethod
    def get_currency_exchange_rate_on_db(dto, model_currency_from, model_currency_to):
        """
        Método que pesquisa no banco de dados se a relação de câmbio entre moedas já foi cadastrada,
        se a moeda existir, retorna o taxa de câmbio, ou seja, exchange_rate.
        se não, pesquisa consulta em uma API externa se essa relação de câmbio existe,
        se existir, cadastra no DB e retorna exchange_rate
        se não, retorna False.

        :param dto: CalculateCurrencyExchangeDto
        :param model_currency_from: Currency
        :param model_currency_to: Currency
        :return: float | False
        """
        try:
            currency_exchange = CurrencyExchange.objects.get(
                iso_code_from=dto.currency_from,
                iso_code_to=dto.currency_to
            )

            exchange_rate = currency_exchange.exchange_rate
        except CurrencyExchange.DoesNotExist:
            exchange_rate = False

        if not exchange_rate:
            currency_adapter = ConsultOpenExchangeRatesAdapter()
            try:
                exchange_rate = currency_adapter.consult_exchange_rate(dto.currency_from, dto.currency_to)

                currency_exchange = CurrencyExchange(
                    iso_code_from=model_currency_from,
                    iso_code_to=model_currency_to,
                    exchange_rate=exchange_rate
                )
                currency_exchange.save()
            except Exception as err:
                print(err)
                exchange_rate = False

        return exchange_rate

    @staticmethod
    def calculate_exchange_value(dto):
        return dto.exchange_rate * dto.amount

    @staticmethod
    def calculate_exchange_rate_based_on_inverse_dto(inverse_dto):
        return 1 / inverse_dto.exchange_rate

    @staticmethod
    def _build_dto_from_validated_request_data(request_data):
        """
        Método que valida e monta o DTO a partir dos dados do request.data
        """
        request_data['currency_from'] = request_data['from']
        request_data['currency_to'] = request_data['to']
        request_data['amount'] = float(request_data['amount'])
        request_data['exchange_rate'] = 0.0
        request_data['exchange_value'] = 0.0

        serializer = CalculateCurrencyExchangeDtoSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        dto = CalculateCurrencyExchangeDto(
            currency_from=data["currency_from"],
            currency_to=data["currency_to"],
            exchange_rate=data["exchange_rate"],
            amount=data["amount"],
            exchange_value=data["exchange_value"]
        )

        return dto
