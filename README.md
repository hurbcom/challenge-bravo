# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

API de conversão monetária.

### Ferramentas utilizadas.
- NodeJS: v12.13.0;
- MongoDB: v4.2.1;
- Redis: v5.0.6;

### Bibliotecas utilizadas.
#### Produção:
- Express: Servidor e roteamento da aplicação;
- Mongoose: Conexão e ORL para MongoDB;
- Cors: Middleware para habilitar cross-origin resourcing share;
- Axios: Consumir serviços externos via HTTP;
- DotEnv: Gerenciamento de variáveis de ambiente;
- Morgan e Winston: Geração de logs da aplicação;
- Redis: Conexão com o Redis;
- Swagger-UI e Swagger-JSDoc: Documentação de rotas;

#### Desenvolvimento:
- Babel: Transpilador Javascript;
- Eslint: Padronização do código;
- Prettier: Formatador automático de código;
- Nodemon: Auto reload baseado em mudanças nos arquivos;
- Jest: Ferramenta de testes;
- Supertest: Ferramenta para realizar teste de integração com a API;

### Sobre a API
A API Bravo possuí 4 rotas, sendo elas respectivamente uma para conversão dos valores, conversão dos valores com cache¹, uma rota para cadastrar uma nova moeda na aplicação e por fim uma para deletar uma moeda.

### Instalação:
#### Passos para rodar a aplicação:
- Clone o repositório e entre na pasta *challenge-bravo*;
- Crie os arquivos *.env* e *.env.test* baseados nos arquivos finalizados com a extensão *.example*;
- Para criar uma API_KEY acesse: https://www.currencyconverterapi.com/
- A aplicação depende das ferramentas NodeJS, Redis e MongoDB. Você pode instalar ou usar Docker (rodando com o Docker para utilizar o comando *docker-compose up*);
- Pelo Docker ele já inicia o serviço, manualmente você pode dar o comando *yarn start* para produção ou *yarn dev* para ambiente de desenvolvimento.
- Para cadastrar as moedas padrões, rode o comando *yarn db:seed*;
- Caso deseje rodar os testes basta usar o comando *yarn test*;
- Caso deseje criar uma build transpilada da aplicação rode o comando *yarn build*;

#### Documentação das rotas:
Você poderá acessar a rota **/api-doc** para obter acesso a todas as rotas da aplicação já documentadas pelo Swagger. E nessa mesma rota poderá testar a aplicação;

¹ A rota com o cache de valores foi desenvolvida devido a uma limitação do serviço de cambio para buscar os valores das moedas, sendo 100 requisições por hora, com o cache do mesmo é possível reduzir o número de requisições ao serviço;

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
