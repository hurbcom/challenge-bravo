# Hurb Currency Converter(HCC)

HCC is a currency converter api developed by the [hurb](https://www.hurb.com/) team.

## Architecture

![Architecture](./docs/api-workflow.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First of all you need to have nodejs + npm installed in your local machine.
You can follow a google tutorial and make sure you have everything installed.

### Installing

Installing npm packages:

```
npm i
```

Now you're ready to play in your local machine.

# Start application

```
npm run start
```

## Running the tests

```
# simple execution
npm run test

# with coverage
npm run test:cov

# in debug mode
npm run test:debug
```

### Break down into end to end tests

```
npm run test:e2e
```

## Latency / Performance

To measure performance, follow these steps:

```
# to build application into javascript instead of typescript
npm run build

# to start the application in javascript mode
node dist/main.js

# in another console/tab/window
node_modules/.bin/loadtest http://127.0.0.1:3000/converter\?from\=USD\&to\=BRL\&amount\=100 -t 20 -c 10 --rps 1000
```

## Documentation

To generate packages documentation:

```
npm run compodoc
```

Also, you can go to swagger endpoint when application is started, just follow the address:
`http://localhost:3000/api`

# Style

This project contains prettier + linter.

```
# To apply linter and search for issues
npm run list

# To apply prettier and format the code
npm run format
```

## Built With

* [nestjs](https://docs.nestjs.com) - The framework used for api

## Authors

* **Lucas Silva** - *Developer* - [github](https://github.com/luqezman)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## Acknowledgments

* Self-Motivation
* Inspiration
* Coffee
