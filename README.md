# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

## Organization of code
- Api
- Api.Tests (With some unit tests)
- WebApp MVC
- Core (With some common objects)
- Docker-compose deploying all the services and dependencies needed

## What was used in this project
- Loadbalancer with nginx
- Cache with redisclient
- Database nosql - Mongodb
- For fiat currency conversion was used: <https://freecurrencyapi.com/>
- For bitcoin quote was used: <https://alternative.me/crypto/api/>

## Requirements

- To run the application you will need Docker in your PC
    - Docker is available in: <https://docs.docker.com/engine/install/>


## How to run
-   To run the code, all you need to do is run the following commands:
    -   git clone https://github.com/rdiass/challenge-bravo.git
    -   cd .\challenge-bravo\CurrencyConverter\
    -   docker-compose up -d --build
-   Now, probably you can access the api in your browser typing: <http://localhost/swagger/index.html>
-   To view the front-end example, you can access: <http://localhost:5101/>