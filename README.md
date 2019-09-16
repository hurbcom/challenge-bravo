# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo
### Teste prático Hurb

Construir uma API, que responda JSON, para conversão monetária.

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=USD&to=BRL&amount=123.45`

### Criado e Testado com:
* Docker 2.1.0.2
* Python 3.7.4
* pip 19.2.3
* django 2.2.5
* PostgreSQL 11.5

### Executando a API:
1. Baixe o projeto no local desejado.
```
git clone https://github.com/arnommaciel/challenge-bravo.git
```
2. Abra a pasta do projeto pelo terminal: 
```
cd challenge-bravo
```
3. Execute o Docker compose: 
```
docker-compose up
```
### Endpoints da API:
1. http://localhost/currency/ 
```
HTTP GET > Lista as moedas disponíveis para conversão
HTTP POST > Cadastra uma nova moeda para conversão
    - Para efetuar o cadastro da moeda, os dados devem ser passados no body do documento em formato JSON.
    Ex: {
        "shortname":"R$",
        "name":"Real",
        "symbol":"BRL"
    }
```
2. http://localhost/currency/[moeda]/
```
HTTP GET > Exibe o cadastro de uma moeda:
HTTP DELETE > Delete o cadastro de uma moeda.
Ex: http://localhost/currency/BRL/
```
3. http://localhost/converter/
```
HTTP GET > Exibe a conversão das moedas informadas nos parâmetros obrigatórios: (from, to, amount).
Ex: http://localhost/converter/?from=BRL&to=USD&amount=123,45
```

#### Observações:
* Para suportar as 1000 requisições por segundo no teste de estresse, configurei um nginx para gerar cache da API.
* Foi utilizado o django REST framework para auxiliar na contrução da API.

#####Obrigado pela oportunidade :)