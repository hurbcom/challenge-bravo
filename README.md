## Desenvolvimento
A API foi escrita utilizando typescript + node + express.
A organização de pastas ficou a seguinte:
```
.
├── src
│   ├── Controllers
│   └── Repository
│   └── Services
│   └── Utils
```

Na pasta Controllers, ficaram os arquivos responsáveis por formar a rota, tratar o body e a passar a lógica para um Services.
Na pasta Services ficaram os arquivos com toda a lógica e regra de negócios.
Na pasta Repository ficaram as lógicas envolvendo banco de dados e popular o banco.
Na pasta Utils ficaram alguns arquivos de apoio ao desenvolvimento.

A lógica base utilizada foi: pegar a moeda que está vindo e converte-la em Dollar, para padronizar todas as cotações.
O fluxo ficou mais ou menos assim, considerando o payload `?from=BTC&to=EUR&amount=123.45`.

- Requisita a cotação do BTC para USD e salva no banco;
- Busca a cotação de EUR para USD, salva no banco;
- Multiplica a `amount` pela cotação do BTC em USD e multiplica o resultado pelo EUR para USD

## Endpoints
### GET `/api/currency/?from=BTC&to=EUR&amount=123.45`
Retorna a cotação seguingo o from e o to;
____

### POST `/api/currency`

Body 
```
{
	"from": "GTA",
	"value": 10
}
```

Cria uma nova cotação em Dolar.

___

### DELETE `/api/currency/GTA`
Remove uma cotação