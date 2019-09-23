# Indice
* [Description](#description)
* [Dependencies](#dependencies)
* [Run project](#run-project)
* [Tests](#tests)
* [Security](#security)

# Description
This project was created to convert currency beetween normal money and crypto coins.

## How this work?
We use two main gems to turn this possible:
- [eu_central_bank](https://github.com/RubyMoney/eu_central_bank)
  This one make the conversion beetween normal currency. ex: USD to BRL.
- [cryptocompare](https://github.com/alexanderdavidpan/cryptocompare)
  This one gives the value of crypto coins in USD for us.

  Basically when necessary the api will convert the crypto coin value to USD and make the conversion to respective currency like BRL.

# Dependencies
For this project you need install docker and docker-compose.

You can find how to install in official [docker documentation](https://docs.docker.com/)

# Run project
To run the project with docker and docker-compose installed run the following commands.

**Note:** If you have mysql installed, turn down the service to not conflict with the one upped for this api.
```bash
service mysql stop
```

Steps:

1. Build the container.

```bash
docker-compose build
```
2. Up the database and api
```bash
docker-compose up
```
3. Create the database.
```bash
docker-compose run web rake db:create
```
3. Run migrations
```
docker-compose run web rake db:migrate
```
4. Run seeds (it's importante run this step to have the basic data for running conversion)
```bash
docker-compose run web rake db:seed
```
5. Done!!! Now you can use the full api.

**Note:** If necessary access the rails console, you can run the following command:
```bash
docker-compose run web rails c
```

# Tests

For tests run following command:
```
docker-compose run web rspec
```
# Security
This project was not prepare to stay out of a VPN!!!
To security use another application to consume the data currency and avoid people from create curenncies from out requests.

**Note:** To access this api from a web page or a client service-side it's necessary the implementation of a cross-origin and authorization from CRUD actions.
