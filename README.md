# 💰 Bravo Challenge

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-003731?style=for-the-badge&logo=mongodb&logoColor=white)

[Documentation](docs.md)

This app was created as a NodeJS coding challenge.  

Build an API, which responds to JSON, for currency conversion. It must have a backing currency (USD) and make conversions between different currencies with real and live values.  

[ [English](README.en.md) | [Português](README.pt.md) ]


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

To run tests, run the following command

```bash
npm run test
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

You can use any programming language for the challenge. Below is the list of languages ​​that we here at Hurb have more affinity:

-   JavaScript (NodeJS)
-   Python
-   Go
-   Ruby
-   C++
-   PHP

## Requirements

-   Fork this challenge and create your project (or workspace) using your version of that repository, as soon as you finish the challenge, submit a _pull request_.
    -   If you have any reason not to submit a _pull request_, create a private repository on Github, do every challenge on the **main** branch and don't forget to fill in the `pull-request.txt` file. As soon as you finish your development, add the user `automator-hurb` to your repository as a contributor and make it available for at least 30 days. **Do not add the `automator-hurb` until development is complete.**
    -   If you have any problem creating the private repository, at the end of the challenge fill in the file called `pull-request.txt`, compress the project folder - including the `.git` folder - and send it to us by email.
-   The code needs to run on macOS or Ubuntu (preferably as a Docker container)
-   To run your code, all you need to do is run the following commands:
    -   git clone \$your-fork
    -   cd \$your-fork
    -   command to install dependencies
    -   command to run the application
-   The API can be written with or without the help of _frameworks_
    -   If you choose to use a _framework_ that results in _boilerplate code_, mark in the README which piece of code was written by you. The more code you make, the more content we will have to rate.
-   The API needs to support a volume of 1000 requests per second in a stress test.
-   The API needs to include real and current quotes through integration with public currency quote APIs

<p style="text-align:center"> Made with 🐝 </p>