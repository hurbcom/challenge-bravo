from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST

from models.ConversionResponse import ConversionResponse
from utils.redis.RedisUtils import RedisUtils


def valida_existencia_moeda(dest, orig):
    if not RedisUtils.verifica_existencia_chave(f"currency:{dest}:{orig}"):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail=f"Moeda {dest} não suportada para conversão!"
        )


def conversao(orig: str, dest: str, orig_value: float) -> ConversionResponse:
    valida_existencia_moeda(dest, orig)
    currency_ratio = RedisUtils.recupera_objeto(f"currency:{dest}:{orig}")
    converted_value = orig_value * currency_ratio
    return ConversionResponse(orig=orig, dest=dest, orig_value=orig_value,
                              converted_value=converted_value)
