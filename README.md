# 💰 Bravo Challenge

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

[Documentation](docs.md)

This app was created as a NodeJS coding challenge.  

Build an API, which responds to JSON, for currency conversion. It must have a backing currency (USD) and make conversions between different currencies with real and live values.  

[ [English](docs/README.en.md) | [Português](docs/README.pt.md) ]

## :floppy_disk: Cloning and Installing
```
git clone https://github.com/debora-rebelatto/challenge-bravo
cd challenge-bravo
npm install
```

## :electric_plug: Connecting to MongoDB Atlas
Run this command on the terminal to create the .env file.
```
touch .env
```
Copy the key avaliable at [this docs]() to the file created at the project root.

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

# :whale2: Docker
## Build Image
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

# :running: Running Tests
## Unit Testing
To run tests, run the following command

```bash
npm run test
```

## Stress Tests
First, install the artillery package globally:
```bash
npm i -g artillery
```

Then run this at the command line:
```bash
artillery run load-test.yml
```

## :mailbox_closed: Postman
[Postman Documentation]()  

### Importing

At the [drive folder](), download the JSON file and import it using the Postman app.

# Requirements
Build an API, which responds to JSON, for currency conversion. It must have a backing currency (USD) and make conversions between different currencies with **real and live values**.

The API must convert between the following currencies:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Other coins could be added as usage.

Ex: USD to BRL, USD to BTC, ETH to BRL, etc...

The request must receive as parameters: The source currency, the amount to be converted and the final currency.

Ex: `?from=BTC&to=EUR&amount=123.45`

Also build an endpoint to add and remove API supported currencies using HTTP verbs.

The API must support conversion between FIAT, crypto and fictitious. Example: BRL->HURB, HURB->ETH

"Currency is the means by which monetary transactions are effected." (Wikipedia, 2021).

Therefore, it is possible to imagine that new coins come into existence or cease to exist, it is also possible to imagine fictitious coins such as Dungeons & Dragons coins being used in these transactions, such as how much is a Gold Piece (Dungeons & Dragons) in Real or how much is the GTA$1 in Real.

Let's consider the PSN quote where GTA$1,250,000.00 cost R$83.50 we clearly have a relationship between the currencies, so it is possible to create a quote. (Playstation Store, 2021).

Ref:
Wikipedia [Institutional Website]. Available at: <https://pt.wikipedia.org/wiki/Currency>. Accessed on: 28 April 2021.
Playstation Store [Virtual Store]. Available at: <https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D>. Accessed on: 28 April 2021.



<p style="text-align:center"> Made with 🐝 </p>