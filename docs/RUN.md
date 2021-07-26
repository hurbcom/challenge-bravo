# Rodando o projeto

Para rodar essa aplicação localmente você pode seguir uma das três opções descritas a seguir.

Opções:

- [Docker Compose](#docker-compose-recomendada); (Recomendada)
- [Manualmente](#manualmente);
- [Docker run](#docker-run).

## **Docker Compose (Recomendada)**

### **Requisitos**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Docker Compose](https://docs.docker.com/compose/install/) versão 1.29.2 ou superior.

---

### **Desenvolvimento**

Após clonar o projeto, execute o seguinte comando para rodar a aplicação:

```sh
docker-compose up
```

> Após os containers subirem, a aplicação (back-end) estará disponível em: [http://localhost:3333/](http://localhost:3333/)

> A aplicação front-end irá subir em: [http://localhost:3000/](http://localhost:3000/)

---

### **Produção**

Para executar o projeto em produção, será necessário criar um arquivo ``.env`` na raiz do projeto **back-end** e preenche-lo, caso seja apenas um teste, basta copiar os valores de ``.env.example``.

```sh
cd backend
```

```sh
cp .env.example .env
```

Com o ``.env`` criado e preenchido, volte a raiz do projeto com ``cd ..`` e rode o seguinte comando:

```sh
docker-compose -f docker-compose.yml up
```

> back-end: [http://localhost:3333/](http://localhost:3333/)

> front-end: [http://localhost:3000/](http://localhost:3000/)

---

## **Manualmente (mais rápida)**

### **Requisitos**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;
- [Docker Compose](https://docs.docker.com/compose/install/) versão 1.29.2 ou superior;
- [Node.js](https://nodejs.org/) versão 14.17.2 ou superior.
- [Yarn](https://yarnpkg.com/) versão 1.22.10 ou superior.

---

### **Desenvolvimento**

Caso decida rodar manualmente, siga as etapas abaixo:

**Subir container do MongoDB:**

```sh
docker-compose up -d db
```

**Subir container do Redis:**

O Redis é opcional, a aplicação funcionará normalmente sem ele, porém não irá se beneficiar da melhoria nos tempos de resposta das requisições que o cache de dados traz.

```sh
docker-compose up -d cache
```

**Instale as dependências:**

Entre no diretório do projeto back-end e instale as dependências.

```sh
cd backend
```

```sh
yarn
```

**Run:**

```sh
yarn dev
```

**Rodando projeto front-end**

Caso deseje executar a aplicação front-end, execute os seguintes comando:
```sh
# Partindo da raiz do projeto
cd frontend
```

```sh
# Instale as dependências
yarn
```

```sh
# Rode o projeto
yarn dev
```

---

### **Produção**

Para executar o projeto em produção, será necessário criar um arquivo ``.env`` na raiz do projeto **back-end** e preenche-lo, caso seja apenas um teste, basta copiar os valores de ``.env.example``.

```sh
cd backend
```

```sh
cp .env.example .env
```

Com o ``.env`` criado e preenchido, volte a raiz do projeto com ``cd ..`` e siga os seguintes passos:

**Subir container do MongoDB:**

```sh
docker-compose -f docker-compose.yml up -d db
```

**Subir container do Redis:**

O Redis é opcional, a aplicação funcionará normalmente sem ele, porém não irá se beneficiar da melhoria nos tempos de resposta das requisições que o cache de dados traz.

```sh
docker-compose -f docker-compose.yml up -d cache
```

**Instale as dependências:**

```sh
cd backend
```

```sh
yarn
```

**Build:**

```sh
yarn build
```

**Run:**

```sh
yarn start
```

**Rodando projeto front-end:**

Caso deseje executar a aplicação front-end, execute os seguintes comando:

```sh
# Partindo da raiz do projeto
cd frontend
```

```sh
# Instale as dependências
yarn
```

```sh
# Buildando o projeto para produção
yarn build
```

```sh
# Executando a build do projeto
yarn start
```

---

## **Docker run**

**Requisitos:**

- [Docker](https://docs.docker.com/engine/install/) versão 20.10.2 ou superior;

---

**Criar network:**

Para que os containers possam se comunicar facilmente, iremos criar uma ``network``:

```sh
docker network create bravo-network
```

**Subir container do MongoDB:**

```sh

```

**Subir container do Redis:**

O Redis é opcional, a aplicação funcionará normalmente sem ele, porém não irá se beneficiar da melhoria nos tempos de resposta das requisições que o cache de dados traz.

```sh
docker run --net bravo-network --name bravoCache -p 6379:6379 -d redis:alpine
```

**Gerar build da imagem:**

```sh
# Desenvolvimento
cd backend
docker build -f Dockerfile -t bravo:node . --target backend_development

# Produção
docker build -f Dockerfile -t bravo:node . --target backend_production
```

**Run:**

Com a build da imagem já criada, vamos executa-la:

```sh
docker run --net bravo-network -it --rm -v ${PWD}/backend:/app -v /app/node_modules -p 3333:3333 -e REDIS_HOST=bravoCache -e POSTGRESQL_HOST=bravoDB bravo:node
```
