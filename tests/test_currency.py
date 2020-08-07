# from src import dal


# try:
#     import sys
#     import os

#     sys.path.append(
#         os.path.abspath(
#             os.path.join(
#                 os.path.dirname(__file__),
#                 '../desafio'
#             )
#         )
#     )
# except:
#     raise


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
        self.currency = Currency(simbol_currency="BRL",
                                 name_description="Real"
                                 )

    @patch('desafio.app.session_scope')
    def test_2_deve_retornar_integrity_error(self, mock_tmp):
        with self.assertRaises(IntegrityError):
            self.currencys.insert(self.currency)

    @patch('desafio.app.session_scope')
    def test_1_deve_retornar_id_currency_depois_add(self, mock_tmp):
        id_currency = self.currencys.insert(self.currency)
        self.assertIsInstance(id_currency, int)
        self.assertEqual(id_currency, 1)

    # @patch('persona.session_scope')
    # def test_3_deve_obter_uma_persona_by_id(self, mock_tmp):
    #     persona = self.personas.get_persona_by_id(self.persona)
    #     self.assertIsInstance(persona.id, int)
    #     self.assertTrue(persona == self.persona)

    # @patch('persona.session_scope')
    # def test_3_deve_obter_uma_persona_by_handle(self, mock_tmp):
    #     persona = self.personas.get_persona_by_handle(self.persona)
    #     self.assertIsInstance(persona.handle, str)
    #     self.assertTrue(persona == self.persona)

    # @patch('persona.session_scope')
    # def test_4_deve_alterar_o_handle_da_persona(self, mock_tmp):
    #     self.persona.character_points = 20
    #     update_persona = self.personas.update(self.persona)
    #     self.assertEqual(update_persona.character_points,
    #                      self.persona.character_points)

    # @patch('persona.session_scope')
    # def test_5_deve_deletar_uma_persona(self, mock_tmp):
    #     self.assertTrue(self.personas.delete(self.persona))
