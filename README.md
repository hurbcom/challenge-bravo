# 💰 Bravo Challenge

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-38598f?style=for-the-badge&logo=postgresql&logoColor=white)

[Documentation](docs.md)

[ [English](docs/README.en.md) | [Português](docs/README.pt.md) ]

This app was created as a NodeJS coding challenge.

Build an API, which responds to JSON, for currency conversion. It must have a backing currency (USD) and make conversions between different currencies with real and live values.

- [💰 Bravo Challenge](#-bravo-challenge)
  - [Requirements](#requirements)
  - [:floppy_disk: Cloning and Installing](#floppy_disk-cloning-and-installing)
  - [:electric_plug: Connecting to Database](#electric_plug-connecting-to-database)
  - [:cd: Starting](#cd-starting)
  - [:whale2: Docker](#whale2-docker)
    - [Build Image](#build-image)
  - [:running: Running Tests](#running-running-tests)
    - [Unit Testing](#unit-testing)
    - [Stress Tests](#stress-tests)
  - [:mailbox_closed: Postman](#mailbox_closed-postman)

## Requirements
Convert between currencies with live and real values. It also allows fictionary currencies to be created.

## :floppy_disk: Cloning and Installing
```
git clone https://github.com/debora-rebelatto/challenge-bravo
cd challenge-bravo
npm install
```

## :electric_plug: Connecting to Database

## :cd: Starting
To run the NodeJS application, run this in the terminal:

```
node src/server.js
```

But, reloading the terminal every time you make an update can be tiring so we can use nodemon to automatically restart the app. Install it globally:
```
npm i -g nodemon
```

and run this command to start the server
```
nodemon
```

## :whale2: Docker
### Build Image
```
docker build -t hurb-app .
```

Your image will now be listed by Docker:

```bash
docker images
```
Start the container and expose port 8000 to port 8000 on the host.

```bash
docker run --publish 8000:8000 hurb-app
```

## :running: Running Tests
### Unit Testing
To run tests, run the following command

```bash
npm run test
```

### Stress Tests
First, install the artillery package globally:
```bash
npm i -g artillery
```

Then run this at the command line:
```bash
artillery run load-test.yml
```

## :mailbox_closed: Postman
Using Postman, create a new collection and import the `hurb-bravo.json` file avaliable at the `docs` folder to import the requests used during development.


<p align="center"> Made with 🐝 </p>