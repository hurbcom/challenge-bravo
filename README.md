# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Este projeto é minha proposta de solução ao [_desafio_](https://github.com/HurbCom/challenge-bravo) apresentado pela empresa Hurb.

## Implementação:

### Escolhas:

Para este desafio escolhi as seguintes tecnologias:

- NodeJS: Escolha pessoal por facilidade de utilização e por ser um ambiente que agrega bastante desempenho à aplicação.
- Express: Por ser um framework estável, adaptável e oferecer um excelente suporte da comunidade. Além, é claro, pela facilidade de utilização do mesmo.
- Redis: Escolhi esse cara para persistir as moedas por ser apenas uma lista de objetos, sendo sua característica cahve-valor muito legal para esta finalidade.
  Além disso, o escolhi para cache das cotações realizadas com a intenção de diminuir o IO das requisições.

### Contratos da API:

#### Listar moedas

**Descrição:** Endpoint que possibilita listar as moedas disponíveis à conversão.

**Regras:** N/A


**MÉTODO / CONTEXTO**

##### `GET`  {base_url}/currencies

**CABEÇALHO**

| Key | Value |
|--|--|
| Content-Type | application/json |

**POSSÍVEIS RESPOSTAS**

| Código HTTP | Descrição | Resposta |
|--|--|--|
| 200 | Lista de moedas disponíveis | ```{ 'result': true, 'message': 'System currencies available list', 'data': [ { 'id': 'INT VALUE', 'currencyCode': 'STRING VALUE'} ]}``` |
| 400 | Requisição mal formatada | ```{ 'result':false, 'message': 'Invalid entries', 'validation': [ ... ]}```  |
| 500 | Erro interno do servidor | ```{ 'result':false, 'message': 'Internal Server Error' }```  |


#### Adicionar moeda

**Descrição:** Endpoint que possibilita a adição de uma nova moeda à lista de conversão.

**Regras:** A moeda adicionda precisa ser uma uma entre as opções da seguinte referência: [_moedas disponíveis_](https://currencylayer.com/currencies)


**MÉTODO / CONTEXTO**

##### `POST`  {base_url}/currencies

**CABEÇALHO**

| Key | Value |
|--|--|
| Content-Type | application/json |

**CORPO DA REQUISIÇÃO**

currency: { type: string, required: true }

**Example**:
```json
{
    "currency": "BRL"
}
```
**POSSÍVEIS RESPOSTAS**

| Código HTTP | Descrição | Resposta |
|--|--|--|
| 201 | Moeda Adicionada com sucesso | ```{ 'result': true, 'message': 'Currency added', 'data': { 'id': 'INT VALUE', 'currencyCode': 'STRING VALUE'}}``` |
| 400 | Requisição mal formatada | ```{ 'result':false, 'message': 'Invalid entries', 'validation': [ ... ]}```  |
| 500 | Erro interno do servidor | ```{ 'result':false, 'message': 'Internal Server Error' }```  |

#### Excluir moeda

**Descrição:** Endpoint que possibilita a exclusão de uma moeda da lista de possíveis moedas.

**Regras:** O identificador informado precisa estar presente na lista de moedas cadastradas no sistema.


**MÉTODO / CONTEXTO**

##### `DELETE`  {base_url}/currencies/:id

**CABEÇALHO**

| Key | Value |
|--|--|
| Content-Type | application/json |

**PARÂMETROS DA REQUISIÇÃO**

id: { type: int, required: true }

**POSSÍVEIS RESPOSTAS**

| Código HTTP | Descrição | Resposta |
|--|--|--|
| 200 | Moeda Excluída com sucesso | ```{ 'result': true, 'message': 'Currency deleted'}``` |
| 400 | Requisição mal formatada | ```{ 'result':false, 'message': "Invalid entries", 'validation': [ ... ]}```  |
| 404 | Moeda Inexistente  | ```{ 'result':false, 'message': 'There is no currency for provided id'}```  |
| 500 | Erro interno do servidor | ```{ 'result':false, message: 'Internal Server Error' }```  |

**METHOD / CONTEXT**

#### Consultar conversão

**Descrição:** Endpoint que possibilita a consulta da conversão de um valor entre duas moedas específicas.

**Regras:** Para que a consulta funcione as moedas informadas precisam ser cadastradas previamente no endpoint de adição de moeda.

**MÉTODO / CONTEXTO**

##### `GET`  {base_url}/currencies/convert

**REQUEST HEADERS**

| Key | Value |
|--|--|
| Content-Type | application/json |

**PARÂMETROS DA CONSULTA**

from: { type: string, required: true }

to: { type: string, required: true }

amount: { type: Number, required: true }

**RESPOSTAS**

| Código HTTP | Descrição | Resposta |
|--|--|--|
| 200 | Consulta realizada com sucesso | ```{ 'result': true, 'message': 'Query executed', 'data': { 'quotationTime': 'DATETIME VALUE', 'Amount': 'NUMBER VALUE', `${FROM_VALUE}`: 'NUMBER VALUE', `${TO_VALUE}`: 'NUMBER VALUE'}}``` |
| 400 | Requisição mal formatada | ```{ 'result':false, 'message': "Invalid entries", 'validation': [ ... ]}```  |
| 500 | Erro interno do servidor | ```{ 'result':false, message: 'Internal Server Error' }```  |


## Orientações:

Para testar/executar a aplicação, favor acessar o arquivo CONTRIBUTING.md

## Observações:
