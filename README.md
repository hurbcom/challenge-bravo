# Challenge-bravo

## Requisitos
1. Ter o Go instalado
2. Ter o Glide instalado

## Instalação

IMPORTANTE: Clone ou mova o repositório dentro do GOPATH.

Clonando e acessando repositório do Github
```
$ git clone https://github.com/EdneyMesquita/challenge-bravo.git
$ cd challenge-bravo
```

Instalando dependencias do Glide
```
$ glide install
```

Executanto projeto
```
$ go run main.go
```

# Documentação da API

## Manipulação de Moedas

### Inserindo novas moedas
Você pode inserir novas moedas enviando dados no formato JSON através da rota ```[POST] /api/currency```.

Você pode enviar os seguintes dados, a API trata de adicionar o valor da moeda baseado no Dólar automaticamente.
```json
{
    "name": "Dólar Canadense",
    "code": "CAD"
}
```

Caso queira adicionar um valor manualmente, basta passar no JSON o campo value, como no exemplo a seguir.
```json
{
    "name": "Dólar Canadense",
    "code": "CAD",
    "value": 2.78
}
```

A resposta será outro JSON, contendo o status da requisição(HTTP Request Codes) e uma mensagem de erro ou de sucesso.

```json
{
    "status": 200,
    "message": "Currency inserted successfully!"
}
```

### Listando as moedas existentes

Você também pode listar todas as moedas cadastradas utilizando ```[GET] /api/currency```.

A resposta será um JSON, contendo o status da requisição e os dados de todas as moedas cadastradas, como exemplificado abaixo.
```json
{
  "status": 200,
  "data": {
    "currencies": [
      {
        "id": 4,
        "name": "Dólar Americano",
        "code": "USD",
        "value": 1
      },
      {
        "id": 2,
        "name": "Dólar Canadense",
        "code": "CAD",
        "value": 1.3289413903
      }
    ]
  }
}
```

### Removendo moedas

Você pode remover moedas cadastradas de duas maneiras, pelo ID utilizando ```[DELETE] /api/currency/{id}``` ou pelo código da moeda utilizando ```[DELETE] /api/currency/code/{code}```.

```
[DELETE] /currency/1
[DELETE] /currency/code/USD
```

A resposta será um JSON, contendo o status da requisição e uma mensagem de erro ou de sucesso.

```json
{
    "status": 200,
    "message": "Currency removed successfully!"
}
```

## Conversão entre moedas

Para realizar a conversão entre moedas, como exigido pela documentação do teste, deve-se passar as seguintes variáveis:
```
?from=...&to=...&amount=...
```
Sendo ```from``` a moeda de origem, ```to``` a moeda "alvo" e ```amount``` o valor desejado. Você deve enviar os dados para ```[GET] /api/exchange```, como no exemplo abaixo.

```
[GET] /exchange?from=BRL&to=CAD&amount=10
```

A resposta será um JSON, contendo o status da requisição e os dados da conversão.

```json
{
  "status": 200,
  "data": {
    "from": "BRL",
    "to": "CAD",
    "amount": 10,
    "total": 3.1254674844883823
  }
}
```