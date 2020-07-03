# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Avaliação - Desafio Bravo

Aplicação desenvolvida em Node.JS com MongoDb.


Acabei optando pelo Node e Mongo para aproveitar o desafio e aprender mais sobre as tecnologias destacadas.

Nesse teste meu objetivo foi:

- Implementar uma API em NodeJS com o MongoDB, acessando um serviço externo para conversão de valores.

## Executar a aplicação
Para executar a aplicação, basta rodar as seguintes linhas de comando:
 - `git clone https://github.com/miqueiasff/challenge-bravo` para clonar o repositório.
 - `cd challenge-bravo` entrando na pasta clonada.
 - `docker-compose up` subindo o docker do banco de dados.
 - `npm install` instalando as dependencias.
 - `npm run seed` carga inicial de dados.
 - `npm run dev` rodando a aplicação.

 ## Lista de moedas previamente carregadas no Mongo (preenchidas ao rodar o comando "seed"):
    - USD
    - BRL
    - EUR
    - BTC
    - ETH

## Endpoint de conversão de moeda

 - `/convert?from=:ORIGEM&to=:DESTINO&amount=:QUANTIDADE`

- **Exemplos**:

`http://localhost:3000/api/converter?from=USD&to=BRL&amount=4`

Resultado:
    {
        "amount": 21.44
    }

## Endpoints de listagem e manipulação

Endereço base: `http://localhost:3000/api/currencies`

Recursos:
   - Listar todas as moedas (ou uma em específico). `GET`
   - Cadastrar a moeda. `POST`
   - Excluir. `DELETE`

Exemplos:

 - `GET`
    http://localhost:3000/api/currencies
    return status 200
        [
            {
                "code": "USD",
                "name": "Dolar Americano"
            },
            {
                "code": "BRL",
                "name": "Real Brasileiro"
            },
            {
                "code": "EUR",
                "name": "Euro"
            },
            {
                "code": "BTC",
                "name": "Bitcoin"
            },
            {
                "code": "ETH",
                "name": "Ethereum"
            }
        ]

- `GET`
    http://localhost:3000/api/currencies/BRL
    return status 200
        {
            "code": "BRL",
            "name": "Real Brasileiro"
        }

- `POST`
    http://localhost:3000/api/currencies
    body
        {
            "code": "ALL",
            "name": "Lek"
        }
    return status 204

- `DELETE`
    http://localhost:3000/api/currencies/ALL
    return status 204

## Regras
Foram implementadas as seguintes regras:
 - Pesquisa:
    - Só é possível converter moedas que estejam previamente cadastradas.
    - Moedas de origem e destino devem ser informadas.
    - O valor a ser convertido deve ser maior que 0 (zero).
 - Cadastro:
    - O código da moeda deve ter um código de no mímino 3 caracteres.
    - O código da moeda deve estar em caixa alta.
    - O nome da moeda precisa ter no mínimo 3 caracteres e no máximo 280.



## Melhorias observadas
 - O processo de colocar a aplicação para rodar deveria conter menos comandos necessários (necessita de mais estudos relativos ao docker-compose).
 - Implementar segurança para as rotas de manipulação de dados (POST/DELETE).
 - Aplicação de teste.



Estou a disposição para qualquer esclarecimento.
Miqueias F Ferreira
miqueiasff@gmail.com
