# Desafio - Hotel Urbano

# Iniciando 🛠

## Variaveis de desenvolvimento necessárias
```bash
# É possivel simplesmente transformar o .env.example em .env
PORT = 8080
DATABASE_HOST = localhost
DATABASE_PORT = 5432
DATABASE_USERNAME = root
DATABASE_PASSWORD = development
DATABASE_SCHEMA = desafio-hurb
REDIS_URL = redis://localhost:6379/
```

## Instalação
```bash
$ npm install
```
## Iniciando o servidor
```bash
$ npm start
```

## Rodando testes
```bash
# Setup do banco para os testes
$ npm run setup:dev
# Roda o setup e os testes
$ npm run test
# Roda somente os testes 
$ npm run test:dev
# Roda o teste de stress/carga
$ npm run test:stress
```

# Tecnologias 💻

- Typescript
- Postgres
- Redis
- Express
- TypeORM
- Joi
- Jest
- Autocannon

# [Documentação Postman](./doc/Desafio%20Hotel%20Urbano.postman_collection.json) 📖