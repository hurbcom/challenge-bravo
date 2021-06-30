# Currencies' Conversion API (challenge-bravo)

A REST API for currencies' conversion using Node.js

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Install [Node](https://nodejs.org/en/)
- (Linux ONLY) Install [Docker Engine](https://docs.docker.com/engine/install/#server) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
- (MacOS or Windows ONLY) Install [Docker Desktop](https://docs.docker.com/desktop/)

### Install and Run

To have a copy of this project up and running, follow the instructions below

- First, download the repository or clone it with the provided URL

- Navigate to the project's folder

```cd ~/[PROJECTS-FOLDER]/```

- With your Docker already configured and running, start the project with the command

```docker-compose up -d```

## Built With

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [Jest](https://jestjs.io/) - JavaScript Testing Framework
- [Yup](https://github.com/jquense/yup) - A JavaScript schema builder for value parsing and validation
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database

## Authors

- **Daniela Rocha** - _Initial work_ - [Daniela Rocha](https://github.com/danirocha)

## Acknowledgments

- Commits messages' convention from [here](https://github.com/pvdlg/conventional-commit-types)
<!-- - Add documentation link here -->

### Commands that can help you cope with some problems:
- `docker-compose down` - Stops all docker services that are running
- `docker-compose logs` - Shows the logs of all running services
- `docker ps -a` - Show status of all your Docker containers, even the stoped ones