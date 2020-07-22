# Intro in project source code

There are few ways to run steps as tests and compilations and for easier life of us this project contains support for a famous task runner called make. You can either take a look in step at [Makefile](https://github.com/guiferpa/challenge-bravo/blob/master/Makefile) of the project or just call `make help`.

### Design for source code

This project uses basically [ports and adapters architecture](http://www.dossier-andreas.net/software_architecture/ports_and_adapters.html) for code structure.

### Directories structure

For directories and the organization of the source code this project uses segmentation for entity reponsabilities.

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
│
├── cmd
│   ├── api
│   │   └── main.go
│   └── doc
│       └── main.go
│
├── go.mod
├── go.sum
├── Makefile
├── pkg
│   └── coin
│       ├── coin.go
│       ├── port.go
│       ├── quota.go
│       └── service.go
│
├── platform
│   └── docker
│       ├── api
│       │   └── Dockerfile
│       └── doc
│           └── Dockerfile
│
└── README.md
```

### What's a command?

Well, the command's a component commonly looks in Golang apps directory structures, take a look in few Golang projects that use this approach.

- [Kubernetes](https://github.com/kubernetes/kubernetes/tree/a054010d032b301e495d1a421f53b9a37a0a0109/cmd)
- [Tsuru](https://github.com/tsuru/tsuru/tree/86132787ea4fa5cb2e6ce8ea99520441fd4df569/cmd)
- [Docker](https://github.com/docker/docker-ce/tree/ab9188d5fd82bf7fcacf4cb5b625d15f50edf939/components/engine/cmd)

The commands can be founded at `./cmd` folder by default. For this project, we just have two commands called **api** and **doc** which is an entry point for compilation of project. It's a good practice you have a folder with entry point files of your Golang application for easier the compilation step.

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

