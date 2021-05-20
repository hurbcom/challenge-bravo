# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo - May/2021

# HURBy - Currency Conversion Api

Esta API tem por objetivo prover uma solução para o [Desafio Bravo](https://github.com/hurbcom/challenge-bravo).

Atualmente a API externa disponibiliza aproximadamente 150 moedas com conversão para:
- BRL (Real Brasileiro)
- USD (Dolar Americano)
- EUR (Euro)

A requisição para conversão de moedas deve ter como parâmetros: `A moeda de origem, a moeda final e o valor a ser convertido`.

Exemplo utilizando as moedas **CAN** (Dólar Canadense) e **EUR** (Euro):
`http://0.0.0.0:5000/hurby/currency/converter?from=CAD&to=EUR&amount=123.45`

Algumas conversões funcionam em mão dupla. Como, por exemplo, entre as moedas CAN e EUR.

A API realiza a conversão de ambas as vias:

`http://0.0.0.0:5000/hurby/currency/converter?from=CAD&to=EUR&amount=123.45`
`http://0.0.0.0:5000/hurby/currency/converter?from=EUR&to=CAD&amount=123.45`

Outras conversões, como por exemplo, entre BTC (Bitcoin) e BRL (Real Brasileiro) a API externa só converte de BTC para BRL:
`http://0.0.0.0:5000/hurby/currency/converter?from=BTC&to=BRL&amount=123.45`

### Integração com a API externa para conversão de moedas
Saiba mais sobre a API **AwesomeAPI** usada para a integração: https://docs.awesomeapi.com.br/api-de-moedas.

A lista de moedas que essa API disponibiliza é copiada uma única vez.

Depois todo gerenciamento da lista de moedas é realizado na API **HURBy**.

O usuário do HURBy pode adicionar e remover moedas.

### Regras
- A API deve suportar conversão entre moedas `verídicas` e `fictícias`;

  **Verídicas** - moedas que vieram da API externa.

  **Fictícias** - moedas que não vieram da API externa (foram cadastradas pelo usuário dessa API HURBy).

  Obs.: Mesmo que a moeda exista no mundo real, ela será considerada fictícia se não veio da API externa.
- Toda moeda (fictícia ou não) deve estar na base de dados da API HURBy.

  Se o usuário `remover` uma moeda não será possível tentar uma conversão utilizando ela.
- A moeda de lastro da API é a USD;

  Se a moeda informada para conversão for fictícia será assumida a moeda lastro (USD).

### Como usar a API HURBy
- Pré-requisitos:
  - Git e Docker
- Execute os seguintes comandos no terminal na pasta raíz do repositório **challenge-bravo**:
```bash
$ git clone https://github.com/antoniojr78/challenge-bravo
$ cd challenge-bravo
challenge-bravo$ docker-compose build --no-cache
challenge-bravo$ docker-compose up
Creating network "challenge-bravo_default" with the default driver
Creating hurby ... done
Attaching to hurby
hurby    | The search for available currencies has started
hurby    |  * Serving Flask app "src.web_api.urls" (lazy loading)
hurby    |  * Environment: production
hurby    |    WARNING: This is a development server. Do not use it in a production deployment.
hurby    |    Use a production WSGI server instead.
hurby    |  * Debug mode: off
hurby    |  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
hurby    | The search for available currencies ended with 155 insertions

```
### Como executar os Testar Unitários
- Pré-requisitos:
  - Git, Python, pip, pipenv e Redis
  - Configurar o arquivo `configmap-<stage>.env` (**stage** é uma variável de ambiente que por padrão a aplicação assume o valor `dev` quando não a encontra).

    A aplicação suporta 3 stages: **dev, hmg e prd**. Esses arquivos de extensão **.env** são muito importantes pois é aonde setamos valores das variáveis de ambiente que a aplicação usa.

    Se quiser trocar o stage, altere o código em `/src/support/configs.py` ou defina no terminal com o comando `export stage=<value>` a variável stage com um dos valores de sua preferência.

    Evite mexer no `configmap-prd.env` pois ele é usado pelo container Docker.

- Execute os seguintes comandos no terminal na pasta raíz do repositório **challenge-bravo**:
```bash
/home/ajunior/my_projects$ git clone https://github.com/antoniojr78/challenge-bravo
/home/ajunior/my_projects$ cd challenge-bravo
/home/ajunior/my_projects/challenge-bravo> pipenv install
/home/ajunior/my_projects/challenge-bravo> export stage=dev
/home/ajunior/my_projects/challenge-bravo> pipenv run pytest tests -v
======================================================================= test session starts ========================================================================
platform linux -- Python 3.7.7, pytest-6.2.4, py-1.10.0, pluggy-0.13.1 -- /home/ajunior/.local/share/virtualenvs/challenge-bravo-Z0t7V9HR/bin/python
cachedir: .pytest_cache
rootdir: /home/ajunior/my_projects/challenge-bravo
collected 7 items

tests/integration/web_api/test_urls.py::TestCaseUrls::test_add_routes PASSED                                                                                  [ 14%]
tests/integration/web_api/routes/test_currency.py::TestCaseCurrency::test_get PASSED                                                                          [ 28%]
tests/integration/web_api/routes/test_currency.py::TestCaseCurrency::test_post PASSED                                                                         [ 42%]
tests/integration/web_api/routes/test_currency.py::TestCaseCurrencyId::test_delete PASSED                                                                     [ 57%]
tests/integration/web_api/routes/test_currency.py::TestCaseCurrencyConverter::test_get PASSED                                                                 [ 71%]
tests/integration/web_api/routes/test_root.py::TestCaseRoot::test_get PASSED                                                                                  [ 85%]
tests/integration/web_api/routes/test_version.py::TestCaseVersion::test_get PASSED                                                                            [100%]

========================================================================= warnings summary =========================================================================
```

## Escolhas Técnicas:

### Desenvolvimento
A API Rest é provida pelo framework **Flask** com **Flask-RESTful**.

As requisições a API externa são executadas com a biblioteca **requests**.

Para gerenciamento de dependências utilizei **Pipenv**.

Utilizei **Commits Semânticos** (com uso de types: ix, feat, docs, style...) para melhor identificação dos commits.


### Documentação da API
Com a aplicação no ar conseguimos acessar a documentação elaborada com **Swagger** na url `http://localhost:5000/apidocs/index.html`.

Nessa página conseguimos executar os endpoints e também verificar o formato das requisições e das respostas de cada endpoint.

### Deploy
Será realizado em ambiente isolado e replicável de container **Docker** conforme descrito mais acima.

### Persistência de dados
As **moedas**, tanto as disponibilizadas pela API externa quanto as criados pelo usuário na API HURBy, são armazenadas e gerenciadas em memória usando o banco de dados NoSql **Redis**.

### Testes de Integração
Os testes foram elaborados no formato **unittest** e a execução será via framework **pytest**.

Inicialmente os testes serão executados fora do conteiner Docker.

### TODO
1- Utilizar mais de uma API externa. Usar, por exemplo, módulo python `sched` para a cada x minutos "procurar" cotações de moedas em mais de uma API;

2- Criar mais testes unitários;

3- Mockar os testes unitários para não precisar usar o Redis;

### Sugestões
- https://docs.awesomeapi.com.br/api-de-moedas
- https://flask.palletsprojects.com/en/2.0.x/
- https://www.python.org/
- https://pypi.org/project/pipenv/
- https://flask-restplus.readthedocs.io/en/stable/
- https://swagger.io/
- https://docs.pytest.org/en/latest/
- https://www.conventionalcommits.org/en/v1.0.0/
- https://docs.docker.com
- https://redis.io/

#### Autor
Antônio Júnior - [LinkedIn](https://linkedin.com/in/antoniojr78)