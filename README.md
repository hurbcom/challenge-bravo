# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

[[English](README.md) | [Portuguese](README.pt.md)]

## How to use?

    - Requirements:
        docker installed

    - Expected Operational System
        - Linux ubuntu

    1) git clone this repository
    2) npm i
    3) run the following codes:
        - docker build -t hurb-api .
        - docker compose build
        - docker compose up

        obs: be sure that there isn't anything running in your port 5432, if you have this problem you can run the following code for linux:
            - sudo lsof -i :5432  ** get the pid number
            - sudo kill -9 <pid>

    ----- At this moment the server and the database must have already running inside a docker container -----

    Routes:
        - POST:  /currency
            required body parameters: *name , *code, *exchange_rate
            It creates a new currency on database;

        - DELETE: /currency/:id
            It deletes currency from the database wich has the given ID;

        - GET: /currency/exchange?from=:currencyCode&to=:currencyCode&amount=:amount_value
            It makes the conversions between the given currencies;

        - GET: /currencies
            It get all currencies from the database;

## Creator Comments

    This api uses two external API's to do the exchange between currencies(COINGATE and EXCHANGE RATE), because the first API's that I've chosen didn't work to exchange Ethereum, and for this reason I took another API to solve this problem, although, that
    another API didn't have a good precision to exchange the other currencies, due to this I've decided to use both.

    Unfortunately I couldn't finish the Integration tests implementation, cause I had some problems with the mock function from jest.

    I've chosen some libs to use in this project, among them we can find:

    - JEST
    - AXIOS
    - DOTENV
    - BODYPARSER
    - EXPRESS
    - PG-PROMISE

    I've chosen the POSTGRESQL to be the database and the MVC pattern to structure the project.

    I hope you enjoy!!

    ----------------------------------------------------------------------------------------------------------------------------------

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

## Evaluation criteria

-   **Organization of code**: Separation of modules, view and model, back-end and front-end
-   **Clarity**: Does the README explain briefly what the problem is and how can I run the application?
-   **Assertiveness**: Is the application doing what is expected? If something is missing, does the README explain why?
-   **Code readability** (including comments)
-   **Security**: Are there any clear vulnerabilities?
-   **Test coverage** (We don't expect full coverage)
-   **History of commits** (structure and quality)
-   **UX**: Is the interface user-friendly and self-explanatory? Is the API intuitive?
-   **Technical choices**: Is the choice of libraries, database, architecture, etc. the best choice for the application?

## Doubts

Any questions you may have, check the [_issues_](https://github.com/HurbCom/challenge-bravo/issues) to see if someone hasn't already and if you can't find your answer, open one yourself. new issue!

Godspeed! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
