# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Dependências

-   Node.js:
É necessário instalar a versão 12.X do Node.js ou posterior.
Para realizar a instalação basta seguir as instruções contidas na documentação oficial do Node.js.

https://nodejs.org/pt-br/download/package-manager/

Git:
Caso necessário, realizar as orientações contidas na página do projeto.

https://git-scm.com/book/pt-br/v2/Come%C3%A7ando-Instalando-o-Git


## Instalação

Para instalar o projeto faça:
&nbsp;

-   Clonar o projeto;
&nbsp;

-   Acessar, pelo terminal de comandos do Sistema Operacional, a pasta onde será depositado o projeto.
&nbsp;

Ex: A pasta "my_project"c riada para receber os arquivos do projeto.
&nbsp;

Para o Linux:
$ cd /home/user/my_project
&nbsp;

Para o Mac:
$ cd /Users/user/my_project
&nbsp;

Para o Windows:
$ cd /c/user/my_project
&nbsp;

-   Digitar o comando para clonar o projeto:
&nbsp;

$ git clone https://github.com/rafaellrf09/challenge-bravo.git
&nbsp;

-   Acessar a pasta do projeto : *cd /challenge-bravo (CONFERIR SE É ESSA PASTA MESMO QUE É CRIADA)*
&nbsp;

-   **Caso tenha Docker instalado**:
&nbsp;
        basta utilizar o comando *docker-compose up --build*;
&nbsp;

-   **Caso não tenha Docker instalado**:
&nbsp;
         copiar o arquivo *.env.example* para *.env* na raiz do projeto;
&nbsp;
         você deverá dar um *npm install*;
&nbsp;
         criar o banco sqlite com *npm run knex:migrate*;
&nbsp;
         criar os dados do banco com *npm run knex:seed*;
&nbsp;

&nbsp;
## Rotas

Por padrão o projeto deverá rodar em: **http://localhost:3333**

-   GET /coins   -> Retorna um array de jsons com as moedas cadastradas no app
-   POST /coins  -> Cria uma nova moeda no app
-   PUT /coins/*:id*  -> Edita uma moeda do app
-   DELETE /coins/*:id*  -> Deleta uma moeda do app
-   GET /conversion?from=*Moeda1*&to=*Moeda2*&amount=*Valor*  -> Realiza a conversão entre duas moedas cadastradas


## Parâmetros das Rotas
POST /coins
&nbsp;

    {
        "name" : "RealTeste",
        "code": "BRLTX",
        "lastro" : 1.5
    }
&nbsp;

PUT /coins/*id*
&nbsp;

    {
        "name" : "Real Brasileiro de verdade",
        "lastro": 3
    }
&nbsp;

DELETE /coins/*id*
&nbsp;

GET /conversion?from=*USD*&to=*BRL*&amount=*500*


## Funcionalidade

O sistema possui uma funcionalidade em que a cada 5 minutos ele acessa a url
*https://economia.awesomeapi.com.br/json/all* para que as moedas sejam
atualizadas automaticamente no sistema.

## Regras de negócio
-   Para cadastro de uma nova moeda o **code** e o **lastro** são  campos obrigatórios;
-   O lastro foi definido como **BRL**;

