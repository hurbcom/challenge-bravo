# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

[[English](README.md) | [Portuguese](README.pt.md)]

## Install

O primeiro passo para configurar a aplicação é criar um arquivo `.env` usando o `.env.example` presente aqui como um guia. Esta aplicação usa [_CoinAPI_](https://www.coinapi.io/) and também [_CoinMarketCap API_](https://coinmarketcap.com/api/) para funcionar. Caso ainda não possua as chaves necessárias solicite nas página correspondentes.

Para rodar o projeto você também precisará do docker instalado na sua máquina. Assumindo que você já possui a instalação apenas rode o comando:

`docker-compose up`

**Warning**: Este projeto possui uma estrutura de Redis embutida para facilitar a execução, Mas em um cenário real uma configuração mais robusta com credenciais de segurança e de preferência fora do container é indicada (Redis possui maior latência ao rodar no Docker). Para mudar o caminho use a variável REDIS no arquivo de ambiente.

Esta aplicação provê uma API para a conversão de valores dada um determinada moeda de origem e destino e uma quantidade. Possui as seguintes moedas como padrão no `.env.example`:
-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Se desejar pode modificar esta lista usando o arquivo `.env`. As moedas principais não podem ser removidas nem editadas via API. 


## Conversão

### Request

`GET /conversion`

    curl --location 'localhost:3100/conversion?from=BTC&to=BRL&decimalPlaces=30'

### Query    
    | Parâmetro       | Descrição                              | Obrigatório | Tipo   |
    | --------------- | -------------------------------------- | ----------- | ------ |
    | `from`          | Moeda de origem                        | Yes         | string |
    | `to`            | Desired currency rate                  | Yes         | string |
    | `amount`        | Quantidade a converter                 | No          | number |
    | `decimalPlaces` | Casas decimais da resposta. Padrão é 8 | No          | number |

### Response

    Status: 200
    Content-Type: application/json

    {
        "from": "BTC",
        "amount": 1,
        "to": "BRL",
        "value": "345964.377343084448906460570000000000"
    }

## Autenticação 

O token retornado neste endpoint é necessário para adicionar e remover outras moedas. Esta versão do projeto só possui um usuário padrão que pode ser configurado no `.env`. O tempo de expiração do token é de 2 horas.

### Request

`POST /login`

    curl --location 'localhost:3100/login' \
    --header 'Content-Type: application/json' \
    --data '{
        "login":"admin",
        "password":"admin"
    }'

### Body  
    | Campo      | Descrição | Obrigatório | Tipo   |
    | ---------- | --------- | ----------- | ------ |
    | `login`    | .env      | Yes         | string |
    | `password` | .env      | Yes         | string |

### Response

    Status: 200
    Content-Type: application/json

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIw....."
    }

## Atualizar Token

### Request

`GET /refesh`

    curl --location 'localhost:3100/refresh' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIwMjYxNDUyNSwiaWF0IjoxNzE2MjAyNjE0LCJleHAiOjE3MTYyMDk4MTR9.yxO-a_LBhcwUVrO4TekbT0beER5YywYBSI5kWaBy_GQ'

### Headers
    | Campo           | Descrição | Obrigatório | Tipo   |
    | --------------- | --------- | ----------- | ------ |
    | `Authorization` | Token     | Yes         | string |

### Response

    Status: 200
    Content-Type: application/json

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIw....."
    }

## Adicionar Moeda

Este endpoint adiciona novas moedas à aplicação. É necessário autenticação

### Request

`POST /add`

    curl --location 'localhost:3100/add' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjE4NzE0MzA2MSwiaWF0IjoxNzE2MTg3MTQzLCJleHAiOjE3MTYxOTQzNDN9.kc862x0RNknfeGI3baiDfKatsSupwLO-MMzD-EJx50I' \
    --header 'Content-Type: application/json' \
    --data '{
        "symbol":"GTA",
        "type":"crypto"
    }'

### Body
    | Campo                 | Descrição                                                 | Obrigatório | Tipo   |
    | --------------------- | --------------------------------------------------------- | ----------- | ------ |
    | `symbol`              | Simbolo da moeda                                          | Yes         | string |
    | `type`                | Tipo da moeda                                             | Yes         | Enum   |
    | `rate`                | Cotação. Apenas para tipo fixo                            | No          | number |
    | `scrpprRateAsset`     | A moeda de destino para procura pelo scrapper. Padrão USD | No          | string |
    | `scrpprUrl`           | Url de página web. Obrigatória para o scrapper            | No          | string |
    | `scrpprAmountTag`     | Tag para procura de quantidade. Padrão de 1               | No          | string |
    | `scrpprRateTag`       | Tag para procura de cotação. Obrigatória para scrapper    | No          | string |
    | `scrpprDecimalSymbol` | Símbolo da casa decimal. Padrão é uma vírgula(,)          | No          | string |

### CurrencyTypes Enum
| Enum       | Descrição                       |
| ---------- | ------------------------------- |
| `fiat`     | Moeda Física                    |
| `Crypto`   | Moeda Cripto                    |
| `Fixed`    | Taxa de câmbio fixa             |
| `Scrapper` | Carrega dados de uma página web |

**Warning**: Os tipo `fixed` e `scrapper` serão ignorados se a moeda for encontrada na CoinAPI.io e/ou MarketCap API. Eles forão desenvolvidos para casos onde não se pode encontrar a moeda pelos meios convecionais. Ex: Moedas fictícias como a D&D Coin.


### Exemplo de como usar o Scrapper 
    curl --location 'localhost:3100/add' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIwNDA3Mzg4MiwiaWF0IjoxNzE2MjA0MDczLCJleHAiOjE3MTYyMTEyNzN9._jjuooOorYKFB4IsQ10MqDWyZTgWmJ29F5llaEA0BW0' \
    --header 'Content-Type: application/json' \
    --data '{
        "symbol":"GTAOnline",
        "type":"scrapper",
        "scrpprRateAsset":"BRL",
        "scrpprUrl":"https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D",
        "scrpprAmountTag":".psw-c-t-2",
        "scrpprRateTag":".psw-t-title-m"
    }'

### Response

    Status: 200
    Content-Type: application/json

    {
        "message": "Asset GTA6 added with success!"
    }


## Remover Moeda

Este endpoint remove moedas da aplicação. É necessário autenticação. Moedas padrão não podem ser removidas. 

### Request

`DELETE /remove/:asset`

    curl --location --request DELETE 'localhost:3100/remove/IOTA' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjE4NzE0MzA2MSwiaWF0IjoxNzE2MTg3MTQzLCJleHAiOjE3MTYxOTQzNDN9.kc862x0RNknfeGI3baiDfKatsSupwLO-MMzD-EJx50I'


### Response

    Status: 200
    Content-Type: application/json

    {
        "message": "Asset GTA6 removed with success!"
    }


Feito! ;)

<p align="center">
  <img src="completed.jpg" alt="Feito!" />
</p>
