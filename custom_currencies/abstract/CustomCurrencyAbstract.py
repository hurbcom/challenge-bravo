from abc import ABC, abstractmethod

from utils.redis.RedisUtils import RedisUtils


class CustomCurrencyAbstract(ABC):

    def obtem_rate_default(self) -> dict:
        dict_rate = {}
        rate = self._get_rate()
        base_currency = RedisUtils.recupera_objeto("currency:base")
        conversao_moeda_conversao_para_base = RedisUtils.recupera_objeto(
            f"currency:{base_currency}:{self._get_nome_moeda_conversao()}")
        base_rate = rate / conversao_moeda_conversao_para_base
        dict_rate[self.get_nome_moeda()] = base_rate
        return dict_rate

    @abstractmethod
    def _get_rate(self) -> float:
        pass

    @abstractmethod
    def get_nome_moeda(self) -> str:
        pass

    @abstractmethod
    def _get_nome_moeda_conversao(self) -> str:
        pass
