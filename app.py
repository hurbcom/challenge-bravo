from typing import List

import uvicorn
from fastapi import FastAPI, Query, Depends, Path, UploadFile, File
from fastapi.openapi.models import APIKey

from models.AdicionaCurrencyResponse import AdicionaCurrencyResponse
from models.ConversionResponse import ConversionResponse
from models.RemoveCurrencyResponse import RemoveCurrencyResponse
from routes import currency
from routes import conversao

tags_metadata = [
    {
        "name": "conversao",
        "description": "Metodo que converte o valor monetário de uma moeda para o seu valor equivalente em outra moeda"
    },
    {
        "name": "currency",
        "description": "Metodos usados para administrar as moedas suportadas pela API"
    }
]

description = """
API feita para converter valores monetários entre diferentes tipos de moeda. Além disso a API também permite inclusão de
novas moedas e a exclusão de moedas antigas
"""

app = FastAPI(title="ConversorDeMoedasAPI",
              description=description,
              contact={
                  "name": "Diogo Nocera Magalhães",
                  "email": "diogo1243@gmail.com",
              },
              openapi_tags=tags_metadata)


@app.get("/conversao", response_model=ConversionResponse, tags=["conversao"])
async def conversao_route(orig: str = Query(..., title="Moeda de Origem", description="Moeda de origem da conversão"),
                          dest: str = Query(..., title="Moeda de Destino", description="Moeda de destino da conversão"),
                          orig_value: float = Query(..., title="Valor a ser Convertido",
                                                    description="Valor que deverá ser convertido")
                          ) -> ConversionResponse:
    return conversao.conversao(orig, dest, orig_value)


@app.delete("/currency/{currency_to_delete}", response_model=RemoveCurrencyResponse, tags=["currency"])
async def remove_suporte_moeda_route(currency_to_delete: str = Path(..., title="Moeda que deixará de ser suportada",
                                                                    description="A moeda que será apagada da lista de "
                                                                                "moedas suportadas pela API")) -> \
    RemoveCurrencyResponse:
    return currency.remove_suporte_moeda(currency_to_delete)


@app.get("/currency", response_model=List[str], tags=["currency"])
async def mostra_moedas_suportadas_route() -> List[str]:
    return currency.mostra_moedas_suportadas()


@app.post("/currency/{currency_to_add}", response_model=AdicionaCurrencyResponse, tags=["currency"])
async def adiciona_moedas_suportadas_route(currency_to_add: str = Path(..., title="Moeda que passará de ser suportada",
                                                                       description="A moeda que será adicionada na "
                                                                                   "lista de moedas suportadas pela "
                                                                                   "API. Apenas moedas existentes são "
                                                                                   "suportadas por esse método")
                                           ) -> AdicionaCurrencyResponse:
    return await currency.adiciona_moeda_default(currency_to_add)


@app.post("/custom/currency", response_model=AdicionaCurrencyResponse, tags=["currency"])
async def adiciona_moedas_custom_route(file: UploadFile = File(...,
                                                               title="Arquvio com o código que será usado para obter o valor da moeda customizada",
                                                               description="Arquivo com o código que será "
                                                                           "usado para obter o calor da moeda "
                                                                           "customizada. Esse código precisa "
                                                                           "conter uma classe de mesmo nome "
                                                                           "que o nome do arquivo. Essa "
                                                                           "classe precisa ser subclasse de "
                                                                           "CustomCurrencyAbstract para que o "
                                                                           "request seja um sucesso")
                                       ) -> AdicionaCurrencyResponse:
    return await currency.adiciona_moedas_custom(file)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, ssl_keyfile='./certs/localhost+2-key.pem',
                ssl_certfile='./certs/localhost+2.pem')
