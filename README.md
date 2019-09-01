# nodejs-currency-quote-api

<h3>Projeto desenvolvido em NodeJS</h3>

<h4>Conteúdo do projeto</h4>

- <b>Dois endpoints:</b> Currency e Quote.

- `/currency` responsável por realizar os métodos CRUD, para as moedas suportadas pela API.
- `/quote` responsável por realizar a conversão entre duas moedas, com ambos os dados passados via parâmetro na URL. Exemplo: `?from=BRL&to=CAD&amount=10` 

- Processo separado em models, controllers e routes para ambos os endpoints.

- Utilizado API **cryptocompare** para realizar as verificação de moedas válidas, e para obter a taxa de câmbio de cada moeda.

- Adicionado tratamento para não permitir inserção de moedas duplicadas.

- Porta teste utilizada: `3001`.

- Evidências de testes disponíveis na pasta <b>tests</b>.

- <b>Framework utilizado:</b> Express.
- <b>Ferramentas utilizadas:</b> Visual Studio Code e Postman.

<hr>

<h4>Testes da API realizados utilizando Postman:</h4>

<h5>Método GET:</h5>

- Listagem de moedas: 
######https://localhost:3001/currency
- Consulta de planos por código: 
######https://localhost:3001/currency/USD
- Conversão de BRL para CAD, quantidade 10: 
######https://localhost:3001/quote?from=BRL&to=CAD&amount=10
>"USD", "BRL", "CAD" e 10 passados por parâmetro.

<h5>Métodos POST e DELETE:</h5>

- Para cadastro e exclusão: 
######https://localhost:3001/currency/BRL
> BRL passado por parâmetro.

<hr>
<h4>Utilização da API:</h4>

- git clone `https://github.com/raphael-ferreira/challenge-bravo.git`
- cd `caminho do projeto`
- npm i
- npm start

<hr>
> Desenvolvido por: Raphael D. Ferreira - 08/2019
