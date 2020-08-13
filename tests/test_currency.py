from desafio.currency.repository import CurrencyRepository
from desafio.currency.model import Currency
from sqlalchemy.exc import IntegrityError
import unittest
from unittest.mock import patch
import pytest


@pytest.mark.usefixtures("app", "client", "runner")
class TestRepositoryPersona(unittest.TestCase):

    def setUp(self):
        self.currencys = CurrencyRepository()
        self.currency = Currency(
            simbol_currency="BRL",
            name_description="Real"
        )

    @patch('desafio.extensions.session_scope')
    def test_1_deve_retornar_id_currency_depois_add(self, mock_tmp):
        id_currency = self.currencys.insert(self.currency)
        self.assertIsInstance(id_currency, int)
        self.assertEqual(id_currency, 1)

    @patch('desafio.extensions.session_scope')
    def test_2_deve_retornar_integrity_error(self, mock_tmp):
        with self.assertRaises(IntegrityError):
            self.currencys.insert(self.currency)

    @patch('desafio.extensions.session_scope')
    def test_3_deve_obter_uma_currency_by_id(self, mock_tmp):
        self.currency.id = 1
        currency = self.currencys.get_currency_by_id(self.currency)
        self.assertIsInstance(currency.id, int)
        self.assertTrue(currency == self.currency)

    @patch('desafio.extensions.session_scope')
    def test_4_deve_obter_uma_currency_by_simbol_currency(self, mock_tmp):
        currency = self.currencys.get_currency_by_simbol_currency(
            self.currency)
        self.assertIsInstance(currency.simbol_currency, str)
        self.assertTrue(currency == self.currency)

    @patch('desafio.extensions.session_scope')
    def test_5_deve_alterar_o_simbol_currency(self, mock_tmp):
        self.currency.simbol_currency = "USD"
        self.currency.name_description = "Dolar"
        self.currency.id = 1

        update_currency = self.currencys.update(self.currency)
        self.assertEqual(update_currency.simbol_currency,
                         self.currency.simbol_currency)

    @patch('desafio.extensions.session_scope')
    def test_6_deve_deletar_simbol_currency(self, mock_tmp):
        self.assertTrue(self.currencys.delete(self.currency))
