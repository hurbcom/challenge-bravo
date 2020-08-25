# TECHS

Para implementação do projeto optei pelo uso do Node.js. O Node.js é uma tecnologia conhecida pela stack do hurb, tem diversas ferramentas (no npm) que auxiliariam um rápido desenvolvimento e também é fácil de aprender. O Node.js tem um contra de necessitar ser clusterizado, para isto utilizei o PM2 p/ resolver o problema.

-   **Awilix**: Para IoC, assim consegui criar singletons e injetá-los com facilidade, facilitando a criação da arquitetura e a aplicação de SOLID.
-   **morgan**: Logging assíncrono, console.log compromete a performance do servidor por ser síncrono.
-   **winston**: Também para facilitar logging.
-   **Express**: Um dos melhores frameworks web atuais.
-   **cors**: Uma biblioteca para facilitar a manipulação de CORS.
-   **axios**: Para requisições HTTP.
-   **knex**: Query-builder para gerenciar o banco de dados.
-   **tcomb**: Para a criação do modelo de domínio.
-   **body-parser**: Para facilitar o parsing do JSON dos dados de requisições HTTP enviados em corpo.
-   **sqlite3**: O banco de dados que utilizei (Ele é simples para se utilizar na memória, então também pode ser configurado com maior facilidade).
-   **codecrumbs**: Overview do código.
-   **supertest/sinon/chai/mocha/node-mocks-http**: Para facilitar testes.
-   **dotenv**: Para facilitar o uso de .env.
-   **cross-env**: Para comandos multiplataforma.
-   **file-system/path**: Para comandos de diretório.
-   **helmet**: Para adicionar cabeçalhos comuns em segurança.
-   **redis**: Para facilitar conexão com o servidor Redis.
-   **swagger-jsdoc/swagger-ui-express**: Criação/Configuração do Swagger.
-   **http-status**: Para gerenciar os status HTTP de forma mais descritiva.
-   **config**: Facilitar acesso à configurações.
-   **ramda**: P/ algumas funções úteis de programação funcional.
-   **pm2**: Clusterização.
-   **nodemon**: Para facilitar o desenvolvimento.

---

-   [Overview](./CHALLENGE.md)
-   [Sobre a arquitetura](./ARCHITECTURE.md)

[Retornar ao README](../README.md)
