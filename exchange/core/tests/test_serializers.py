from django.test import TestCase
from rest_framework import serializers

from exchange.core.models import Currency
from exchange.core.serializers import (
    CurrencySerializer,
    ConvertCurrencySerializer,
    QueryParamsErrorSerializer,
    Http404Serializer)


class CurrencySerializerFieldsTest(TestCase):
    def test_fields(self):
        """CurrencySerialiser must have these fields:
        pk, code, backed_to, rate, type, updated_at
        """
        serializer = CurrencySerializer()

        contents = (
            ('pk', serializers.IntegerField),
            ('code', serializers.CharField),
            ('backed_to', serializers.CharField),
            ('rate', serializers.FloatField),
            ('type', serializers.ChoiceField),
            ('updated_at', serializers.DateTimeField),
        )

        for field, instance in contents:
            with self.subTest():
                self.assertIsInstance(serializer.fields[field], instance)


class CurrencySerializerCreate(TestCase):
    def setUp(self):
        """Creates a currency for all tests"""
        self.currency = CurrencySerializer().create(
            {'code': 'brl', 'backed_to': 'usd', 'rate': 5.321})

    def test_instance(self):
        """Currency created must be instance of CurrencyModel"""
        self.assertIsInstance(self.currency, Currency)

    def test_code_uppercase(self):
        """Currency `code` must be uppercase"""
        self.assertEqual('BRL', self.currency.code)

    def test_backed_to_uppercase(self):
        """Currency `backed_to` must be uppercase"""
        self.assertEqual('USD', self.currency.backed_to)

    def test_rate(self):
        """Currency `rate` must be 5.321"""
        self.assertEqual(5.321, self.currency.rate)


class CurrencySerializerUpdate(TestCase):
    def setUp(self):
        """Creates and updates currency for all tests"""
        self.currency = CurrencySerializer().create(
            {'code': 'brl', 'backed_to': 'usd', 'rate': 5.321})

        self.currency = CurrencySerializer().update(
            self.currency, {'code': 'btc', 'backed_to': 'brl', 'rate': 1.0})

    def test_code(self):
        """Currency `code` must be uppercase"""
        self.assertEqual('BTC', self.currency.code)

    def test_backed_to(self):
        """Currency `backed_to` must be uppercase"""
        self.assertEqual('BRL', self.currency.backed_to)

    def test_rate(self):
        """Currency `rate` must be 1.0"""
        self.assertEqual(1.0, self.currency.rate)


class ConvertCurrencySerializerFieldsTest(TestCase):
    def test_fields(self):
        """ConvertSerialiser must have these fields:
        from_, to, amount, rates, converted_amount
        """
        serializer = ConvertCurrencySerializer()

        contents = (
            ('from_', serializers.CharField),
            ('to', serializers.CharField),
            ('amount', serializers.FloatField),
            ('rates', serializers.ListField),
            ('converted_amount', serializers.FloatField),
        )

        for field, instance in contents:
            with self.subTest():
                self.assertIsInstance(serializer.fields[field], instance)


class QueryParamsErrorSerializerFieldsTest(TestCase):
    def test_fields(self):
        """ConvertSerialiser must have these fields:
        from_, to, amount, errors
        """
        serializer = QueryParamsErrorSerializer()

        contents = (
            ('from_', serializers.CharField),
            ('to', serializers.CharField),
            ('amount', serializers.CharField),
            ('errors', serializers.ListField),
        )

        for field, instance in contents:
            with self.subTest():
                self.assertIsInstance(serializer.fields[field], instance)


class Http404SerializerFieldsTest(TestCase):
    def test_fields(self):
        """ConvertSerialiser must have these fields:
        from_, to
        """
        serializer = Http404Serializer()

        contents = (
            ('from_', serializers.CharField),
            ('to', serializers.CharField),
        )

        for field, instance in contents:
            with self.subTest():
                self.assertIsInstance(serializer.fields[field], instance)
