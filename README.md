# Challenge-Bravo

Api Restful de conversão de moedas

### Instalação
A aplicação foi feita em Python e usando banco de dados MongoDB.
Portanto, é necessário ter o Python (v3) e o MongoDB instalado em sua máquina para conseguir rodar o projeto.

Execute-o em ambiente virtual

`$ source .venv/Scripts/activate`

E instale todas as dependências do projeto no ambiente:

`$ pip install -r requirements.txt`

Configure seus banco de dados de acordo com o arquivo *database.ini*. 

E finalmente, para executá-lo (por padrão, roda na porta 5000 do localhost)

`$ python app.py`

### Utilização

A API dispôe dos verbos e seus endpoints: 

***Index para conversão de moedas:***
- GET: http://127.0.0.1:5000?from=BTC&to=EUR&amount=123.45
-- from = símbolo da moeda base
-- to = símbolo da moeda para conversão
-- amount = valor a ser convertido


**Lista todas as moedas disponíves**
- GET: http://127.0.0.1:5000/currencies


**Obtem a moeda pelo determinado {symbol}**
- GET: http://127.0.0.1:5000/currencies/{symbol}

**Insere uma nova moeda sendo declarado no body da requisição. **
- POST: http://127.0.0.1:5000/currencies/

**Formato do body:**

`{
  "symbol": [symbol],\
}`


** Remove uma moeda já inserida pelo {symbol} **
- DELETE: http://127.0.0.1:5000/invoices/{symbol}


### Testes

Os testes foram feitos com a biblioteca PyTest. Para rodá-los, utilize o comando na raiz do projeto:

`$ pytest`


### Últimas Atualizações

- *09/ago - Primeiro commit - API funcional*

- *09/ago - Adicionando testes unitários e correções*

- *10/ago - Inicializando arquivos de docker*