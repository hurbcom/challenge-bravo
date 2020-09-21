## Pré-Requisitos

- Iniciar o docker  `docker-compose up`
- Chamar a rota  `GET /exchange/lastest` para inicializar as cotações do dia.


### Endpoints

-   Listar todas as moedas : `GET /currency`

-   Moeda por código:  `GET /currency/:codigo` - exemplo: `currency/BRL`

-   Cadastrar moeda:  `POST /currency` - exemplo: `JSON {"codigo": "XAA", "data": "2020-09-16",  "cotacao": "1"}

-   Remover moeda : `DELETE /currency/:codigo` - exemplo:`currency/XAA` 

-   Atualizar cotações : `GET /exchange/lastest`

-   Converter moedas : `GET /exchange/converter?from=BRL&to=USD&amount=20`

## Teste unitário
 `yarn run test  `

## Teste Stress
 `artillery run config.yaml`
