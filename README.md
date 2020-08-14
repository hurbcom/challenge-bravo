# API para conversão de moedas

## Descrição
API construída utilizando princípios de domain driven design junto do microframework para web em Ruby chamado [Roda](https://github.com/jeremyevans/roda) com [Sequel](https://github.com/jeremyevans/sequel) como ORM.

Para as cotações utilizei a API do [Cryptocompare](https://www.cryptocompare.com/)

# Dependências
- Ruby
- PostgresSQL

# Uso

1. Instalar bibliotecas
Com Ruby e o Postgres já instalados, seguir esses passos:
```zsh
bundle install
```
4. Adicionar as variáveis de ambiente. O projeto tem um arquivo `.env.example` que pode ser utilizada como as configs.
```zsh
mv .env.example .env
```
3. Criar o banco de dados, migrar e popular
```zsh
rake db:create && rake db:migrate && rake db:seed
```
4. Carregar o aplicativo
```zsh
rackup
```

Pronto! Agora a api estará exposta na porta `9292`.

# Testes

Para rodar os testes, ir para a raiz do projeto e rodar o comando:
```
rspec
```

# TODO
 - Apesar de eu ter iniciado a configuração dos containeres docker, acabei que tive alguns problemas no meu sistema operacional e fiquei sem tempo de ajeitar os containeres como desejava.
 - Aumentar a cobertura de testes. Como utilizei esse desafio como uma maneira  de aprendizedo, acabei testando apenas algumas classes e não cheguei a construir os testes de integração para a API. Como utilizei um microframework, eu precisaria investir mais tempo para preparar o ambiente corretamente para simular os testes de integração.
 - Melhor maneira de configurar a gem `Money` para adicionar novas criptomoedas. Utilizei a gem `Money` para realizar as operações com as moeadas porém ela nao tem as criptomoeads configuradas por padrão, para tal precisei configurar na mão e hoje essas configs estão hard coded quando poderiam estar em uma tabela de configuração.
 - Cache em memória para aumentar a performance. Como o projeto depende de uma api externa, o ideal seria cachear os request para aumentar a performance e diminuir a chance de ter o limite de requests estourado.

# Documentação da API

**GET CURRENCIES**
----
 Cria um usuario novo
* **URL**
  /api/v1/currencies
* **Method:**
  `GET`
* **Success Response:**
  * **Code:** 200
    **Content:**
    ```JSON
    [
      {
        "id": 1,
        "name": "US Dollar",
        "code": "USD",
        "type": "fiat_money",
        "created_at": "2020-08-12 23:05:01 -0300",
        "updated_at": null
      },
      ...
    ]

**GET CONVERSION RATES**
----
 Authenticate user
* **URL**
  /api/v1/convert?from=BRL&to=ETH&amount=123.45
* **Method:**
  `GET`
* **Get Params**
* **from**: Código da moeda base
* **to**: Código da moeda final a ser convertida
* **ammount**: Valor da moeda
* **Success Response:**
  * **Code:** 200 <br>
    **Content:**
    ```JSON
    {
      "from": "BRL",
      "to": "ETH",
      "amount": 123.45,
      "quotation": "0.056922795 Ξ",
      "ballast": "USD",
      "ballast_quotation": "$22.406175"
    }
* **Error Response:**
  * **Code:** 400 BAD REQUEST
    **Content:**
    ```JSON
    {
      "error": "Currency code not found",
      "status": 400
    }
**CREATE CURRENCY**
----
 Cria nova moeda
* **URL**
  /api/v1/currency
* **Method:**
  `POST`
*  **Headers**
  `Content-Type:application/json`
*  **Body**
    ```JSON
    {
      "name": "Argentina Pesos",
      "type": "fiat_money",
      "code": "ARS"
    }
    ```
* **Success Response:**
  * **Code:** 200 <br>
    **Content:**
    ```JSON
    {
        "id": 6,
        "name": "Argentina Pesos",
        "code": "ARS",
        "type": "fiat_money",
        "created_at": "2020-08-13 11:15:41 -0300",
        "updated_at": null
    }
* **Error Response:**
  * **Code:** 400 BAD REQUEST
    **Content:**
    ```JSON
    {
        "error": "error message",
        "status": 400
    }