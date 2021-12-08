# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

[[English](README.md) | [Português](README.pt.md)]

## Documentação

para a documentação completa da API [clique aqui](https://studio-ws.apicur.io/sharing/704c636f-f851-4e1b-b00b-ae33b8edde20)

## Comandos

Eu utilizei o Yarn como gerenciador de pacotes então algum desses comandos funcionarão apenas com o yarn (os comandos de teste)

uso: `yarn`  ou `npm run`  **comando**

`start` - inicia o projeto buildado (JS) 

`dev` - builda o projeto e inicia o container da aplicação (requer docker-compose)

`watch`  - executa o projeto sem buildar(TS) em modo de observação

`build` - builda o projeto

`debug` - inicia o modo de debug na porta 9222

`test` -  comando base para testes

`test:unit` - comando para testes unitários

`test:integration` -  comando para testes de integração

`test:staged` -  comando para os testes em staged (roda os testes relacionados no commit)

`test:ci` - teste de integração contínua

## Sobre minhas escolhas

### Clean Architecture

Eu escolhi seguir o padrão de Clean Architecture que pode ser bem difícil de entender em um primeiro momento, mas após alguns minutos olhando para o projeto você pode facilmente entender o motivo de ter tantos arquivos e o porquê de as coisas estarem em pastas estranhas. Eu tentei dividir as camadas da aplicação em pastas como: data, domain, infra, presentation e main.



- A pasta Domain contém interfaces para os nossos casos de uso, nossos modelos e outras coisas que pertencem  ao nosso domínio de negócio;

- A pasta Data contém os protocolos para implementar os casos de uso utilizando o banco de dados;

- A pasta Infra contém nossas implementações de repositórios para banco de dados ou serviços externos, nossas funções, bibliotecas e helpers que gerenciam criptografia ou outros tratamentos de dado;

- A pasta Presentation contém nossos controllers, erros customizados, helpers, interfaces internas e outros;

- A pasta Main Contém nossa configuração de projeto, adapters para utilizar bibliotecas externas sem ter um alto nivel de acoplamento delas no projeto, factories, configurações de rotas e middlewares, e outras funcionalidades que fazem o projeto funcionar mas não pertencem às regras de negócio.

  

### Conventional Commits

Todos os commits foram feitos seguindo o  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) e o  **husky**+**git-commit-msg-linter** garantiram isso!

### TDD

O Projeto inteiro foi desenvolvido usando TDD mesmo que os testes tenham sido commitados após os arquivos de produção eles foram criados antes. mas para facilitar git revert e outras ações de git os arquivos de produção foram commitados primeiro sempre(se uma feature foi revertida os testes dela não deveriam existir)

**Cem por cento de cobertura de testes**

| File                                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                                   | 100     | 100      | 100     | 100     |                   |
| data/usecases                               | 100     | 100      | 100     | 100     |                   |
| db-add-currency.ts                          | 100     | 100      | 100     | 100     |                   |
| db-delete-currency.ts                       | 100     | 100      | 100     | 100     |                   |
| db-get-currency.ts                          | 100     | 100      | 100     | 100     |                   |
| db-list-currencies.ts                       | 100     | 100      | 100     | 100     |                   |
| db-update-currency.ts                       | 100     | 100      | 100     | 100     |                   |
| db-upsert-currency.ts                       | 100     | 100      | 100     | 100     |                   |
| infra/db/mongodb/helpers                    | 100     | 100      | 100     | 100     |                   |
| mongo-helper.ts                             | 100     | 100      | 100     | 100     |                   |
| infra/db/mongodb/repositories/currency      | 100     | 100      | 100     | 100     |                   |
| currency-mongo-repository.ts                | 100     | 100      | 100     | 100     |                   |
| infra/services                              | 100     | 100      | 100     | 100     |                   |
| free-currency-api-service.ts                | 100     | 100      | 100     | 100     |                   |
| presentation/controllers/currency           | 100     | 100      | 100     | 100     |                   |
| add-currency-controller.ts                  | 100     | 100      | 100     | 100     |                   |
| convert-currency-controller.ts              | 100     | 100      | 100     | 100     |                   |
| delete-currency-controller.ts               | 100     | 100      | 100     | 100     |                   |
| get-currency-controller.ts                  | 100     | 100      | 100     | 100     |                   |
| update-currency-controller.ts               | 100     | 100      | 100     | 100     |                   |
| presentation/errors                         | 100     | 100      | 100     | 100     |                   |
| business-rule-error.ts                      | 100     | 100      | 100     | 100     |                   |
| invalid-param-error.ts                      | 100     | 100      | 100     | 100     |                   |
| missing-param-error.ts                      | 100     | 100      | 100     | 100     |                   |
| server-error.ts                             | 100     | 100      | 100     | 100     |                   |
| unique-param-error.ts                       | 100     | 100      | 100     | 100     |                   |
| presentation/helpers                        | 100     | 100      | 100     | 100     |                   |
| cron-helper.ts                              | 100     | 100      | 100     | 100     |                   |
| http.ts                                     | 100     | 100      | 100     | 100     |                   |
| presentation/jobs                           | 100     | 100      | 100     | 100     |                   |
| currency-seeder.ts                          | 100     | 100      | 100     | 100     |                   |
| update-currencies-using-external-service.ts | 100     | 100      | 100     | 100     |                   |
| validation/validators                       | 100     | 100      | 100     | 100     |                   |
| numeric-field-validation.ts                 | 100     | 100      | 100     | 100     |                   |
| optional-field-validation-composite.ts      | 100     | 100      | 100     | 100     |                   |
| required-field-validation.ts                | 100     | 100      | 100     | 100     |                   |
| string-without-space-validation.ts          | 100     | 100      | 100     | 100     |                   |
| validiation-composite.ts                    | 100     | 100      | 100     | 100     |                   |
| validation/validators/business-rules        | 100     | 100      | 100     | 100     |                   |
| currency-shortName-validation.ts            | 100     | 100      | 100     | 100     |                   |
| unique-currency-shortName-validation.ts     | 100     | 100      | 100     | 100     |                   |
### Dependencias

O projeto foi escrito em **Typescript** usando **express** 

O banco de dados utilizado foi o  **MongoDb** mas isso pode ser mudado criando novas implementações para as interfaces dos repositórios e substituindo nas instancias.

Os testes automatizados foram feitos utilizando**Jest** com outros plugins como **ts-jest** e **jest-mongodb**

Para tarefas e outros processos em segundo plano eu escolhi utilizar o **node-schedule** que é uma poderosa biblioteca de agendamento de tarefas.



## Requisitos

- [x] O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)

     ***Eu criei um arquivo docker-compose para executar a aplicação em um container***

- [x] Para executar seu código, deve ser preciso apenas rodar os seguintes comandoss: 

  ​		git clone \$your-fork  &&  cd \$your-fork &&  command to install dependencies &&  command to run the application

  **O comando para iniciar a aplicação em um container é ** `npm run dev` or `yarn dev`

- [x] A API pode ser escrita com ou sem a ajuda de *frameworks*

  **Eu utilizei Express mas 'adaptei'  ele dessa forma o framework é utilizado apenas para iniciar a aplicação e gerenciar as rotas**

- [x] A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.

  **Testado com o  Jmeter**

- [x] A API precisa contemplar cotações de verdade e atuais através de integração com APIs públicas de cotação de moedas

  **As cotações são atualizadas duas vezes por minuto usando a ** [FreeCurrencyAPI](https://freecurrencyapi.net)

