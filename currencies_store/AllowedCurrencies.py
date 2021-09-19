from typing import Dict, List

from utils.redis.RedisUtils import RedisUtils


class AllowedCurrencies:
    allowed_currencies: Dict[str, str]
    default_allowed_currencies: List[str] = [
        "USD",
        "BRL",
        "EUR",
        "BTC",
        "ETH"
    ]
    chave_redis: str = "currency:allowed_currencies"

    @staticmethod
    def get_allowed_currencies() -> Dict[str, str]:
        if hasattr(AllowedCurrencies, "allowed_currencies") and AllowedCurrencies.allowed_currencies is not None:
            return AllowedCurrencies.allowed_currencies
        else:
            if RedisUtils.verifica_existencia_chave(AllowedCurrencies.chave_redis):
                AllowedCurrencies.allowed_currencies = RedisUtils.recupera_objeto(AllowedCurrencies.chave_redis)
            else:
                AllowedCurrencies.allowed_currencies = AllowedCurrencies.default_allowed_currencies
                RedisUtils.salva_objeto(AllowedCurrencies.chave_redis, AllowedCurrencies.allowed_currencies)
            return AllowedCurrencies.allowed_currencies

    @staticmethod
    def add_allowed_currency(currency: str) -> None:
        AllowedCurrencies.get_allowed_currencies().append(currency)
        RedisUtils.salva_objeto(AllowedCurrencies.chave_redis, AllowedCurrencies.get_allowed_currencies())

    @staticmethod
    def remove_allowed_currency(currency: str) -> None:
        AllowedCurrencies.get_allowed_currencies().remove(currency)
        RedisUtils.salva_objeto(AllowedCurrencies.chave_redis, AllowedCurrencies.get_allowed_currencies())
        for allowed_currency in AllowedCurrencies.get_allowed_currencies():
            RedisUtils.apaga_chave(f"currency:{currency}:{allowed_currency}")
            RedisUtils.apaga_chave(f"currency:{allowed_currency}:{currency}")

    @staticmethod
    def recover_redis_allowed_currencies() -> None:
        AllowedCurrencies.allowed_currencies = RedisUtils.recupera_objeto(AllowedCurrencies.chave_redis)
