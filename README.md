## Running Project

### `cd api`


### `yarn`

To install dependencies

### `yarn dev`

To run project


## Running Project with Docker

### `docker build -t bravo .`

To build image docker

### `docker run -p 3333:3333 bravo`

To run application on port 3333

## Routes

`GET` : `http://localhost:3333/api/v1/currency?from=BRL&to=EUR&amount=10.50`

`POST` : `http://localhost:3333/api/v1/currency`

example: {
	"currency": "BRL"
}

`DELETE` : `http://localhost:3333/api/v1/currency?currency=BRL`