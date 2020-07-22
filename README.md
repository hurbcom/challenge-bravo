# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Challenge Bravo

![master](https://github.com/guiferpa/challenge-bravo/workflows/master/badge.svg)

This project is a solution for the [Hurb Challenge](CHALLENGE.md)

## Get started

This project use [Coinbase](https://www.coinbase.com) and [Exchangerates](https://exchangeratesapi.io) as base for your datas served then your feel free to set custom parameters like this flags below:
```bash
$ ./dist/bin/api -help
                                                                                   
Usage of ./dist/bin/api:
  -coinbase-api-key string
    	set a custom Coinbase api key
  -coinbase-api-secret string
    	set a custom Coinbase api secret
  -coinbase-api-url string
    	set a custom Coinbase api url (default "https://api.coinbase.com")
  -currency-base string
    	set currency base (default "USD")
  -exchangerates-api-url string
    	set a custom Exchangerates api url (default "https://api.exchangeratesapi.io")
  -port string
    	service port (default "8000")
```

### Compile and run API command
```bash
make api && ./dist/bin/api -coinbase-api-key CYIRbG2bDxT4n25H -coinbase-api-secret Ix7WG6cCaqjJ7Dp8xR03r7YvWLdsAHCe
```

#### Coinbase credentials to test
- **Coinbase key:** `CYIRbG2bDxT4n25H`
- **Coinbase secret:** `Ix7WG6cCaqjJ7Dp8xR03r7YvWLdsAHCe`

### Compile and run API Documentation command
```bash
make doc && ./dist/doc
```

### Running others steps

All steps put out her output file(s) to **dist folder**.

Well, there are many way to do this.

#### Execute the pipeline builder and run the API
```bash
make && ./dist/bin/api
```
Using this command others steps will be called to **test source code**, **lint source code** and **Swagger spec generation**.

#### Compile and running per command
```bash
make <command> && ./dist/bin/<command>
```

#### Using docker to run app
```bash
make docker-image-api && docker run -d \
  --name challenge-bravo-api \
  -p 8000:8000 \
  -e COINBASE_API_KEY=CYIRbG2bDxT4n25H \
  -e COINBASE_API_SECRET=Ix7WG6cCaqjJ7Dp8xR03r7YvWLdsAHCe \
  challenge-bravo-api
```

#### Requirements

- [x] **Go 1.13**
- [x] **Docker 19.03.x** - *This dependency only will be used if build docker image step will be called*

The tools that help in some steps will be installed by Make automatically.

### Running tests

```bash
make test
```

### Generation spec Swagger
```
make <command>-spec
```

For more details you can call the `make help` command. Look at below the help output:
```bash
$ make help
                 
install                        Call 'make install' or just call 'make' it's same mean
lint                           Run lint for source code
test                           Run tests
api                            Build the command api
doc                            Build the command doc
docker-image-api               Build the docker image for command api
docker-image-doc               Build the docker image for command doc
api-spec                       Generate Swagger for your API specification into dist folder
help                           Display available commands
```

## Interesting knowledge about the project

- [What is a command?](PROJECT_DETAILS.md#whats-is-a-command)
- [Design of source code from project](PROJECT_DETAILS.md#design-of-source-code-from-project)
- [Structure of directories](PROJECT_DETAILS.md#structure-of-directories)
