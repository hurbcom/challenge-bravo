# Endpoints

## Currencies

---

**GET /currencies**

Lista todas moedas.

**Exemplo**

Corpo da resposta (JSON)

```json
{
  "data": [
    {
      "code": "USD",
      "rate": 1
    },
    {
      "code": "ETH",
      "rate": 0.0008283
    },
    {
      "code": "EUR",
      "rate": 0.9452
    },
    {
      "code": "BRL",
      "rate": 5.26
    },
    {
      "code": "BTC",
      "rate": 0.00004787
    }
  ]
}
```

Respostas

| Código | Descrição                  |
| ------ | -------------------------- |
| 200    | Moeda obtidas com sucesso. |
| 500    | Erro no servidor.          |

\
\
&nbsp;

**GET /currencies/:code**

Obtem uma moeda.

Parâmetros no **_path_**:

| Propriedade | Descrição       | Tipo   | Obrigatório |
| ----------- | --------------- | ------ | ----------- |
| code        | código da moeda | string | sim         |

**Exemplo**

Path

```
GET /currencies/BRL
```

Corpo da resposta(JSON)

```json
{
  "data": {
    "code": "BRL",
    "rate": 5.26
  }
}
```

Respostas

| Código | Descrição                                              |
| ------ | ------------------------------------------------------ |
| 200    | Moeda obtida com sucesso.                              |
| 404    | Não foi possível achar uma moeda com o código enviado. |
| 500    | Erro no servidor.                                      |

\
\
&nbsp;

**POST /currencies**

Registra uma nova moeda.

Parâmetros no corpo da requisição:

| Propriedade | Descrição       | Tipo                  | Obrigatório                |
| ----------- | --------------- | --------------------- | -------------------------- |
| name        | nome da moeda   | string                | não                        |
| code        | código da moeda | string                | sim                        |
| type        | tipo da moeda   | 'real' \| 'fictitious | sim                        |
| rate        | valor da moeda  | number                | sim para type 'fictitious' |

**Exemplo**

Corpo da requisição (JSON)

```json
{
  "name": "Bitcoin",
  "code": "BTC",
  "type": "real"
}
```

Corpo da resposta (JSON)

```json
{
  "data": {
    "name": "Bitcoin",
    "code": "BTC",
    "type": "real",
    "rate": 0.00004787
  }
}
```

Respostas

| Código | Descrição                                 |
| ------ | ----------------------------------------- |
| 201    | Moeda registrada com sucesso.             |
| 400    | Dados inválidos.                          |
| 422    | Já existe uma moeda com o código enviado. |
| 422    | O código enviado não é de uma moeda real. |
| 500    | Erro no servidor.                         |

\
\
&nbsp;

**PUT /currencies/:code**

Atualiza uma moeda. Somente moedas fictícias podem ser atualizadas.

Parâmetros no **_path_**:

| Propriedade | Descrição       | Tipo   | Obrigatório |
| ----------- | --------------- | ------ | ----------- |
| code        | código da moeda | string | sim         |

Parâmetros no corpo da requisição:

| Propriedade | Descrição       | Tipo   | Obrigatório |
| ----------- | --------------- | ------ | ----------- |
| name        | nome da moeda   | string | não         |
| code        | código da moeda | string | sim         |
| rate        | valor da moeda  | number | sim         |

**Exemplo**

Path

```
PUT /currencies/BTC
```

Corpo da requisição (JSON)

```json
{
  "code": "BTC",
  "rate": 0.00005
}
```

Corpo da resposta (JSON)

```json
{
  "data": {
    "name": "Bitcoin",
    "code": "BTC",
    "type": "real",
    "rate": 0.00005
  }
}
```

Respostas

| Código | Descrição                                              |
| ------ | ------------------------------------------------------ |
| 200    | Moeda atualizada com sucesso.                          |
| 400    | Dados inválidos.                                       |
| 404    | Não foi possível achar uma moeda com o código enviado. |
| 422    | Somente moedas fictícias podem ser atualizadas.        |
| 500    | Erro no servidor.                                      |

\
\
&nbsp;

**DELETE /currencies/:code**

Deleta uma moeda.

Parâmetros no **_path_**:

| Propriedade | Descrição       | Tipo   | Obrigatório |
| ----------- | --------------- | ------ | ----------- |
| code        | código da moeda | string | sim         |

**Exemplo**

Path

```
DELETE /currencies/BRL
```

Corpo da resposta

```
OK
```

Respostas

| Código | Descrição                                              |
| ------ | ------------------------------------------------------ |
| 200    | Moeda deletada com sucesso.                            |
| 404    | Não foi possível achar uma moeda com o código enviado. |
| 500    | Erro no servidor.                                      |

\
\
&nbsp;

## Conversion

---

**GET /conversion?from={code}&to={code}&amount={value}**

Converte um valor de uma moeda para outra.

Parâmetros **_query_**:

| Propriedade | Descrição              | Tipo   | Obrigatório |
| ----------- | ---------------------- | ------ | ----------- |
| from        | código da moeda        | string | sim         |
| to          | código da moeda        | string | sim         |
| amount      | valor a ser convertido | number | sim         |

**Exemplo**

Path

```
GET /conversion?from=USD&to=BRL&amount=10
```

Corpo da resposta

```json
{
  "data": {
    "amount": 10,
    "to": "BRL",
    "from": "USD",
    "result": 52.6
  }
}
```

Respostas

| Código | Descrição                                                    |
| ------ | ------------------------------------------------------------ |
| 200    | Conversão realizada com sucesso.                             |
| 400    | Dados inválidos.                                             |
| 422    | Não foi possível fazer a conversão com a moeda especificada. |
| 500    | Erro no servidor.                                            |
