# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

[[English](README.md) | [Portuguese](README.pt.md)]

## Documentation

for full API documentation [click here](https://studio-ws.apicur.io/sharing/704c636f-f851-4e1b-b00b-ae33b8edde20)

## Commands

I've used Yarn as package manager so some of theese commands will only work with yarn (the test commands)

usage: `yarn`  or`npm run`  **command**

`start` - start the built project 

`dev` - build the project and start the application container (needs docker-compose)

`watch`  - run project without build(TS) in watch mode

`build` -builds the project

`debug` - start debug mode on port 9222

`test` -  base test command

`test:unit` - unit test command

`test:integration` -  integration test command

`test:staged` -  staged test command (run related tests on commit)

`test:ci` - continuous integration test

## About my choices

### Clean Architecture

I've chose to follow clean architecture patterns which can be very difficult to understand at the first moment, but with a few minutes looking to the project you can easily understand why it has too many files and why the things are in 'strange' folders. I tried to split the application layers into folders like: data, domain, infra, presentation and main.

- The Domain folder contains interfaces to our use-cases, our models and other things which belongs to our business domain;
-  The Data folder contains the protocols to implement our usecases using database*
-  The Infra folder contains our database implementations to repositories, our external services implementations to repositories, our functions, libs and helpers which handle cryptography or other data treatment;
-  The presentation layer includes our controllers, custom errors, helpers, internal interfaces and other;
- The main folder contains our project configuration, adapters to use external libs without high attach then to the project, factories,routes and middleware configurations and other feature that makes the project work but don't belongs to business rules

### Conventional Commits

All project commits are made following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and **husky**+**git-commit-msg-linter** ensures that!

### TDD

All project was developed using TDD even the tests being committed after the production files, they're created before then. but to facilitate git revert or other git actions the production files are always committed first(if a feature was reverted the tests should not exists)

**A Hundred percent test coverage**

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
### Dependencies

The project was wrote in **Typescript** using **express** 

The database used was **MongoDb** but it can be changed making new implementations for repository interfaces and replacing then on the instances.

The automated tests was made using **Jest** with other plug ins like **ts-jest** and **jest-mongodb**

For tasks and other background process I've chose to use **node-schedule** which is a powerful lib to schedule tasks.



## Requirements

- [x] The code needs to run on macOS or Ubuntu (preferably as a Docker container)

     ***I've created a docker-compose file to run the application on container***

- [x] To run your code, all you need to do is run the following commands: 

  ​		git clone \$your-fork  &&  cd \$your-fork &&  command to install dependencies &&  command to run the application

  **The command to start application in the container is ** `npm run dev` or `yarn dev`

- [x] The API can be written with or without the help of _frameworks_

  **I've used Express but I adapt the framework so at this point the framework is used only to start the application and handle the routes**

- [x] The API needs to support a volume of 1000 requests per second in a stress test.

  **Tested with Jmeter**

- [x] The API needs to include real and current quotes through integration with public currency quote APIs

  **the currencies are updated twice per minute using ** [FreeCurrencyAPI](https://freecurrencyapi.net)

