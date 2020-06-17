# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Instalação

Para instalar o projeto faça:
-   Clone o Projeto;
-   Acesse a pasta do projeto;
-   **Caso tenha Docker instalado**:
        basta utilizar o comando "docker-compose up --build";
-   **Caso não tenha Docker instalado**:
         você deverá dar um "npm install";
         criar o banco sqlite com "npm run knex:migrate";
         criar os dados do banco com "npm run knex:seed";

-   Ser feliz;

## Rotas

-   GET /coins   -> Retorna um array de jsons com as moedas cadastradas no app
-   POST /coins  -> Cria uma nova moeda no app
-   PUT /coins/:id  -> Edita uma moeda do app
-   DELETE /coins/:id  -> Deleta uma moeda do app
-   GET /conversion?from="Moeda1"&to="Moeda2"&amount="Valor"  -> Realiza a conversão entre duas moedas cadastradas


## Parâmetros das Rotas
POST /coins
    {
        "name" : "RealTeste",
        "code": "BRLTX",
        "lastro" : 1.5
    }

PUT /coins/8
    {
        "name" : "Real Brasileiro de verdade",
        "lastro": 3
    }

DELETE /coins/8

GET /conversion?from="USD"&to="BRL"&amount="500"

