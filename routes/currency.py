import importlib
import os
from typing import List

from fastapi import HTTPException, UploadFile
from starlette.status import HTTP_400_BAD_REQUEST

from currencies_store.AllowedCurrencies import AllowedCurrencies
from custom_currencies.abstract.CustomCurrencyAbstract import CustomCurrencyAbstract
from models.AdicionaCurrencyResponse import AdicionaCurrencyResponse
from models.RemoveCurrencyResponse import RemoveCurrencyResponse
from routines import update_currencies
from utils.redis.RedisUtils import RedisUtils


def remove_suporte_moeda(currency_to_delete: str) -> RemoveCurrencyResponse:
    AllowedCurrencies.remove_allowed_currency(currency_to_delete)
    return RemoveCurrencyResponse(name=currency_to_delete, success=True)


def mostra_moedas_suportadas() -> List[str]:
    return AllowedCurrencies.get_allowed_currencies()


def verifica_se_moeda_existe(currency_to_add: str):
    moedas_default_suportadas = RedisUtils.recupera_objeto("currency:default_currencies")
    return currency_to_add in moedas_default_suportadas


async def adiciona_moeda_default(currency_to_add: str) -> AdicionaCurrencyResponse:
    if verifica_se_moeda_existe(currency_to_add):
        AllowedCurrencies.add_allowed_currency(currency_to_add)
        await update_currencies(None)
        return AdicionaCurrencyResponse(name=currency_to_add, success=True)
    else:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Moeda {currency_to_add} não existe, portanto não pode ser adicionada dessa forma!"
        )


def verifica_existencia_classe(clazz_name, file, module):
    if not hasattr(module, f"{clazz_name}"):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Arquivo {file.filename} não contém uma classe de nome clazz_name para uso!"
        )


def carrega_classe_moeda_custom(file: UploadFile) -> type:
    clazz_name = os.path.splitext(file.filename)[0]
    module = importlib.import_module(f"custom_currencies.currencies.{clazz_name}")
    verifica_existencia_classe(clazz_name, file, module)
    custom_currency_clazz = getattr(module, f"{clazz_name}")
    return custom_currency_clazz


async def salva_arquivo_moeda_custom(file: UploadFile) -> None:
    with open(f"./custom_currencies/currencies/{file.filename}", "wb") as file_to_write:
        contents = await file.read()
        file_to_write.write(contents)
    await file.close()


def verifica_validade_moeda_custom(custom_currency_clazz: type) -> bool:
    if not (issubclass(custom_currency_clazz, CustomCurrencyAbstract)):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Classe {custom_currency_clazz} não é subclasse de CustomCurrencyAbstract!"
        )


def cria_moeda_redis(custom_currency_clazz):
    nome_moeda = custom_currency_clazz().get_nome_moeda()
    AllowedCurrencies.add_allowed_currency(nome_moeda)
    list_custom_currencies = obtem_lista_de_moedas_customizadas()
    list_custom_currencies.append(custom_currency_clazz.__name__)
    RedisUtils.salva_objeto("currency:custom_currencies", list_custom_currencies)


def obtem_lista_de_moedas_customizadas():
    if RedisUtils.verifica_existencia_chave("currency:custom_currencies"):
        list_custom_currencies = RedisUtils.recupera_objeto("currency:custom_currencies")
    else:
        list_custom_currencies = []
    return list_custom_currencies


def verifica_validade_metodo_obtencao_rate(custom_currency_clazz):
    try:
        custom_currency_clazz().obtem_rate_default()
    except:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Classe {custom_currency_clazz} com erro na execucao do método obtem_rate_default!"
        )


async def adiciona_moedas_custom(file: UploadFile):
    await salva_arquivo_moeda_custom(file)
    custom_currency_clazz = carrega_classe_moeda_custom(file)
    verifica_validade_moeda_custom(custom_currency_clazz)
    verifica_validade_metodo_obtencao_rate(custom_currency_clazz)
    cria_moeda_redis(custom_currency_clazz)
    await update_currencies(None)
    return AdicionaCurrencyResponse(name=custom_currency_clazz().get_nome_moeda(), success=True)
