import re

import requests
if __name__ == "__main__":
    GTACustomCurrency().obtem_rate_default()
from bs4 import BeautifulSoup

from custom_currencies.abstract.CustomCurrencyAbstract import CustomCurrencyAbstract


class GTACustomCurrency(CustomCurrencyAbstract):

    def _get_rate(self) -> float:
        pagina_ps_store = requests.get(
            "https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D/")
        soup = BeautifulSoup(pagina_ps_store.text, "lxml")
        valor_brl = self.recupera_valor_brl(soup)
        valor_gta = self.recupera_valor_gta(soup)
        rate = float(valor_gta) / float(valor_brl)
        return rate

    def recupera_valor_gta(self, soup):
        texto_com_info_valor_gta = soup.select(".psw-c-t-2")[0].text
        busca_gta = re.search(r'.*GTA\$(\d{0,3}?\.?\d{3}?\.?\d{3}).*', texto_com_info_valor_gta)
        valor_gta = busca_gta.group(1)
        valor_gta = valor_gta.replace(".", "")
        return valor_gta

    def recupera_valor_brl(self, soup):
        valor_brl = soup.select(".psw-t-title-m")[0].text.split("R$ ")[1].strip()
        valor_brl = valor_brl.replace(",", ".")
        return valor_brl

    def get_nome_moeda(self) -> str:
        return "GTA"

    def _get_nome_moeda_conversao(self) -> str:
        return "BRL"

