
## Quick Start

1 - Clone this repo.<br>
2 - In terminal go to the root directory<br>
3 - Build the docker image (it will install all dependencies):
```bash
docker build -t hurb_challenge_bravo ./
```
4 - Run API:
```bash
docker-compose up
```

## About This Project
This project is part of the Bravo challenge proposed by Hurb, which consists in developing an API for currency conversion.
The proposed solution is an API is based on the RESTFull standards and was implemented using the following technologies:
<p align="center">
  <img src="misc/images/core_technologies.fw.png" alt="Core technologies involved" />
</p>


## Solution Architecture
The following figure presents the architecture and data flow within the proposed application:

<p align="center">
  <img src="misc/images/archteture.fw.png" alt="Solution Architecture" />
</p>

## How this Works
The google currency library was used to fetch the updated values from the google finance service.

### Converter
User can convert values using a GET request to the following route:
```bash
http://127.0.0.1:8080/currency/converter/?from=<SOURCE>&to=<DESTINY>&amount=<VALUE>
```

### Create New Currency
The user can register new currencies by passing an identifier code and the equivalent value in USD in a POST request through the following endpoint:

```bash
http://127.0.0.1:8080/currency/add
```
You must be logged into the API. Use the following JSON message structure:

```bash
{
"code":"ABC",
    "in_usd": 1.23
}
```

### Update Currency (fictitious only)
The user can update an currencies by passing an identifier code and the new equivalent value in USD in a PUT request through the following endpoint:

```bash
http://127.0.0.1:8080/currency/update
```
You must be logged into the API. Use the following JSON message structure:

```bash
{
"code":"ABC",
    "in_usd": 1.23
}
```

### List All Currencies (fictitious only)
User can list all fictitious currencies using a GET request to the following route:
```bash
http://127.0.0.1:8080/currency/list
```


<!-- docker run -p 8080:80 -it -e APP_MODULE="server:api" myimage -->


**It is not possible to perform the conversion between two fictitious currencies because this use case is not covered by the challenge specification. Please check the challenge description at: https://github.com/hurbcom/challenge-bravo#-desafio-bravo**





