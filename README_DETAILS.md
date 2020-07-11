# Challenge Bravo

![master](https://github.com/guiferpa/challenge-bravo/workflows/master/badge.svg)

## Data flows design

This template uses basically [ports and adapters architecture](http://www.dossier-andreas.net/software_architecture/ports_and_adapters.html) for application data flow.

## Directories structure

For directories and the organization of the source code this template uses basically segmentation for entity reponsabilities.

Let's look the directories:
```bash
.
├── adapter
│   ├── primary
│   │   └── http
│   │       ├── rest
│   │       │   ├── coin.go
│   │       │   └── router.go
│   │       └── static
│   │           ├── router.go
│   │           └── statik.go
│   └── secondary
│       └── http
│           └── rest
│               └── repository.go
├── cmd
│   ├── api
│   │   └── main.go
│   └── doc
│       └── main.go
├── dist
│   └── bin
│       ├── api
│       └── doc
├── go.mod
├── go.sum
├── Makefile
├── pkg
│   └── coin
│       ├── coin.go
│       ├── port.go
│       ├── quota.go
│       └── service.go
├── platform
│   └── docker
│       ├── api
│       │   └── Dockerfile
│       └── doc
│           └── Dockerfile
├── README_DETAILS.md
├── README.md
└── spec
    ├── swagger.json
    └── swagger.yaml
```

### What's a command?

Well, the command's a component commonly looks in Golang apps directory structures, take a look in few Golang projects that use this approach.

- [Kubernetes](https://github.com/kubernetes/kubernetes/tree/a054010d032b301e495d1a421f53b9a37a0a0109/cmd)
- [Tsuru](https://github.com/tsuru/tsuru/tree/86132787ea4fa5cb2e6ce8ea99520441fd4df569/cmd)
- [Docker](https://github.com/docker/docker-ce/tree/ab9188d5fd82bf7fcacf4cb5b625d15f50edf939/components/engine/cmd)

The commands can be founded at `./cmd` folder by default. For this template, we just have two commands called **api** and **doc** which is an entry point for execution of project. It's a good practice you have a folder with entry point files of your Golang application for easier the compilation step.

We could compile differents binaries with this command directory structure as the Kubernetes project do. All directories below which are a different binary could find in `./cmd` at Tsuru source code.

```bash
...
├── tsurud
│   ├── api.go
│   ├── api_test.go
│   ├── checker.go
│   ├── checker_test.go
│   ├── command.go
│   ├── command_test.go
│   ├── gandalf.go
│   ├── main.go
│   ├── main_test.go
│   ├── migrate.go
│   ├── migrate_test.go
│   ├── signals.go
│   ├── signals_notsupported.go
│   ├── suite_test.go
│   ├── testdata
│   │   ├── tsuru2.conf
│   │   └── tsuru.conf
│   ├── token.go
│   └── token_test.go
├── utils.go
└── utils_test.go
```

## Intro in project code

There are few ways to run development steps as tests and compilations and for easier life of us this template contains support for a famous task runner called make. You can either take a look in step at [Makefile](https://github.com/iupay/golang-http-api/blob/master/Makefile) of the project or just call `make help`.

## Requirements

- [x] **Go 1.13**
- [x] **Docker 19.03.x** - *This dependency only will be used if build docker image step will be called*

The tools that help in some steps will be installed by Make automatically.

## Steps

### Running the project directly (without compilation step)

> Comming soon

### Running the project compiled

All steps put out her output file(s) to **dist folder**.

Well, there are many way to do this.

#### Just compile and run the project
```bash
make build && ./dist/bin/<command>
```

#### Execute a compilation pipeline and run the project
```bash
make && ./dist/bin/<command>
```

Using this commands others steps will be called to test **source code**, **lint source code** and **Swagger spec generation**.

### Running tests

Nowadays this template only contamples **unit tests**

```bash
make test
```

### Generation spec Swagger
```
make <command>-spec
```

## Questions

For any questions or improvement for this doc feel free to open a **pull request** or an **issue**.
