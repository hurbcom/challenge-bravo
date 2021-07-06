# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Foi construida uma API que responda JSON, para conversão monetária, a sua moeda de lastro é o Dolar Americano (USD).

A API vem com as seguintes moedas de build e, as suas conversões são referentes ao dia 04/07/2021:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

## Inicialização da API

-   Para executar essa API, é preciso apenas rodar os seguintes comandos:
    -   git clone https://github.com/MA-Andrade/challenge-bravo
    -   cd challenge-bravo
    -   ``./run_application.sh``
-   Os dockers serão construidos e iniciados em background.

## Utilização da API

A API fica contida na porta 5000 e pode ser acessada por ``localhost:5000``.

O padrão de utilização do símbolo da moeda são 3 letras maiúsculas (_e.g._ USD, BRL, EUR, BTC, ETH)
O padrão dos valores utilizado é baseado no Dólar Americano, fornecido através da chave ``"value"`` pelo body da request e **sempre** deverá ser numérico e no formato internacional _(decimal separado por ``.`` e sem o separador de milhares)_.
-   **Rota Principal**
    - **GET** - ``/api/convert/$FROM-$TO-$VALUE`` Realiza a conversão da moeda inicial ``$FROM`` para a moeda resultado ``$TO`` convertendo o valor ``$VALUE`` _Atentar para separação dos parâmetros por hífen `-`_
-   **Rotas Secundárias**
    - **GET** - ``api/currency/`` Retorna todas as moedas e os seus valores baseados em USD
    - **POST** - ``api/currency/new`` Cria uma nova moeda. Deve ser fornecido o body da request um JSON que contem um campo ``"symbol"`` que irá conter o símbolo da moeda no formato e um campo ``"value"`` com seu valor em relação ao Dólar Americano. _e.g._ ``{ "symbol": "EUR", "value": 1.19 }``
    - **GET** - ``api/currency/$SYMBOL`` Retorna uma moeda e seu valor. ``$SYMBOL`` deve corresponder ao seu símbolo.
    - **PUT** - ``api/currency/$SYMBOL`` Altera o valor de uma moeda. ``$SYMBOL`` deve corresponder ao seu símbolo e deve-se fornecer no body da request um único parâmetro numérico chamado ``"value"`` correspondente ao seu valor em relação ao Dólar Americano.
    - **DELETE** - ``api/currency/$SYMBOL`` Remove uma moeda. ``$SYMBOL`` deve corresponder ao seu símbolo.
