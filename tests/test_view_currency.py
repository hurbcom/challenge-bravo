import pytest
from http import HTTPStatus
import unittest
from unittest.mock import Mock
from unittest.mock import patch
import json


@pytest.mark.parametrize(
    "currency_data, expected_status, expected_data",
    [({"simbol_currency": "XRP", "name_description": "XRP"},
        HTTPStatus.CREATED, {'message': 'Sua moeda foi criada com sucesso'}
      ), ({"simbol_currency": "nao existe", "name_description": "nao existe"},
          HTTPStatus.NO_CONTENT,  {'message': 'Essa moeda não existe'}),
        ({"simbol_currency": "XRP", "name_description": "XRP"},
         HTTPStatus.CONFLICT,
         {'message': "A moeda ja existe"})])
@patch('desafio.extensions.session_scope')
def test_1_deve_adicionar_uma_moeda(self, client, currency_data,
                                    expected_status,
                                    expected_data):
    url = "/currency"
    response = client.post(url, json=currency_data)

    assert response.status_code == expected_status
    if response.status_code == 200:
        assert response.json == expected_data


@patch('desafio.extensions.session_scope')
def test_2_dever_obter_a_cotacao_da_moeda(self, client):
    expected_json = {
        "BRL": ""
    }

    url = "/currency?from=XRP&to=BRL&amount=1"
    response = client.get(url)

    assert response.status_code == HTTPStatus.OK
    assert response.json.keys() == expected_json.keys()


@patch('desafio.extensions.session_scope')
def test_3_dever_falhar_por_falta_query_string_to_or_from(self, client):
    expected_json = {'error': "necessario as querys strings from e to"}

    url = "/currency?&to=BRL&amount=1"
    response = client.get(url)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == expected_json


@patch('desafio.extensions.session_scope')
def test_4_dever_falhar_ao_buscar_amount_nao_inteiro(self, client):
    expected_key = 'error'
    url = "/currency?from=XRP&to=BRL&amount=valor_invalido"
    response = client.get(url)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert expected_key in response.json.keys()


@patch('desafio.extensions.session_scope')
def test_5_dever_falhar_ao_buscar_moeda_inexistente_na_base(self, client):
    url = "/currency?from=BRL&to=BTC&amount=1"
    response = client.get(url)

    assert response.status_code == HTTPStatus.NO_CONTENT


@patch('desafio.extensions.session_scope')
def test_6_dever_listar_moedas(self, client):
    url = "/currency/all"
    response = client.get(url)
    assert response.status_code == HTTPStatus.OK


@patch('desafio.extensions.session_scope')
def test_7_dever_remover_moeda(self, client):
    url = "/currency/XRP"
    response = client.delete(url)
    assert response.status_code == HTTPStatus.OK


@patch('desafio.extensions.session_scope')
def test_8_dever_retornar_no_content_caso_nao_exista_moeda(self, client):
    url = "/currency/XRP"
    response = client.delete(url)
    assert response.status_code == HTTPStatus.NO_CONTENT
