<h1 align="center">
  <img src="https://i.ibb.co/fDytf3k/Lista-Rango-1.gif" alt="Bravo Currency Conversion" width="100%"/>
</h1>

# Challenge Bravo

> API RESTful capaz de realizar conversões monetárias e cadastrar novas moedas.

- [Tecnologias](#Tecnologias)
- [Decisões Técnicas](#decisões-técnicas)
- [Desafios](#Desafios)
- [Melhorias](#possíveis-melhorias)
- [Arquitetura](#Arquitetura)
- [Instalação](#Instalação)
- [Testes](#Testes)

**✨ Demo BACK-END:** [**https://challenge-bravo.ribeirogab.me**](https://challenge-bravo.ribeirogab.me)

**✨ Demo FRONT-END:** [**https://challenge-bravo.vercel.app**](https://challenge-bravo.vercel.app)

# Tecnologias

###### Linguagens e ferramentas:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)

###### Banco de Dados:

- [MongoDB](https://www.mongodb.com/)

###### Front-end:
- [Next.js](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com/)

###### Testes unitários:

- [Jest](https://jestjs.io/)

###### Cache:

- [Redis](https://redis.io/)

###### Ambiente

- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

###### Padronização de código/commits:

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Commitizen](https://github.com/commitizen/cz-cli)

# Decisões Técnicas

**Puppeteer:**

O Puppeteer foi escolhido para realizar o scraping de dados da conversão monetária do próprio Google. Esta decisão foi tomada por conta de opções de APIs terem um limite gratuito muito baixo.

Ao ser chamado com os parâmetros ``from``, ``to`` e ``amount`` o Puppeteer realiza uma busca em uma URL neste formato: "https://www.google.com/search?q=from+usd+to+brl" que abre o seguinte:

<img src="https://i.ibb.co/Wnh1z6C/Screenshot-20210726-104839.png" alt="from BRL to USD" width="600px"/>

Após os campos carregarem, o Puppeteer irá inserir o ``amount`` no primeiro input e capturar o valor do segundo input, tudo isso feito via seletores CSS.

Com isso, temos o valor desejado convertido que é enviado no retorno da rota:

```json
{
  "result": 5.18
}
```

---

**MongoDB:**

O banco de dados selecionado para o projeto foi o MongoDB, por conta de possuir apenas uma tabela (collection) e não ter nenhum tipo de relacionamento foi a opção mais viável no momento.

---

**Redis:**

O Redis tem um papel muito importante nesta aplicação, por conta do Puppeteer executar uma instância do Chromium em segundo plano para realizar as conversões, isso acaba custando muito processamento e atrasando as respostas aos clients, com o cache isso é resolvido parcialmente. Por exemplo:

Um client realiza uma requisição com os seguintes parâmetros: ``from: 'brl'``, ``to: 'btc'``, ``amount: 1``.

O service fará a chamada ao Puppeteer que por sua vez executará o Chromium para capturar o valor convertido, após isso o provider do Puppeteer devolve o ``result`` para o service que é responsável por armazenar o cache.

Quando outro client realizar a mesma chamada (``from: 'brl'``, ``to: 'btc'``, ``amount: 1``) irá receber o resultado instantâneamente.

*O Cache possuí tempo de expiração de 1 hora.*

---

**Next.js:**

O Next.js foi utilizado para construção do front-end da aplicação, por se tratar de uma aplicação pequena, não foi possível aproveitar todos os benefícios da ferramenta.

O Chakra UI foi utilizado para facilitar e agilizar a diagramação do layout e dos componentes. O resultado final foi esse:

<img src="https://i.ibb.co/KVxpkWC/2021-07-26-11-42-10.gif" alt="from BRL to USD" width="100%"/>

> Se quiser ver em realtime: [https://challenge-bravo.vercel.app](https://challenge-bravo.vercel.app/)

# Desafios

- Configurar Puppeteer + Docker;
- Configurar front-end e back-end em um mesmo projeto utilizando Docker e Docker Compose.

# Possíveis melhorias

**Testes de integração:**

A aplicação possuí somente testes unitários, uma ótima melhoria seria a implementação de testes de integração para aumentar ainda mais a confiabilidade da API.

---

**Precisão dos testes unitários:**

Atualmente os testes do ``service`` de conversão de moedas estão tratando somente duas casas decimais, para conversões que envolvem criptomoedas (Bitcoin e Ethereum) seria interessante ter um número maior. O motivo essa diminuição no número de casas é a inconsistência do JavaScript em lidar com muitos números depois da vírgula, em alguns casos gerando divergências e causando a falha do teste.

---

**Testes no front-end:**

Implementação de testes no front-end para garantir que os inputs, components e o layout estão funcionando como esperado.

---

**API de conversão de moedas:**

Atualmente a aplicação possui um ``provider`` de cotações com uma única implementação:

- Puppeteer;

Com o Puppeteer é possível buscar as cotações das moedas diretamente do Google, sem nenhum custo por isso, porém é bem custoso na questão de velocidade de resposta.

Uma requisição leva em média de 3 ~ 5 segundos para retornar a resposta, o que é um tempo bastante considerável (o cache ajuda a diminuir esse tempo).

Possíveis soluções:

- Criar uma implementação do [currencylayer](https://currencylayer.com/):

  O **currencylayer** possui cotação e conversão da maioria das moedas, possivelmente seria a melhor opção, porém o plano gratuito permite apenas **250** requisições por mês, o que acaba tornando inviável para uma aplicação que visa crescimento.

---

**API KEY:**

Como a API não tem nenhuma forma de autenticação e todas as rotas são públicas isso a torna muito insegura e vulnerável.

No momento a autenticação via ``API KEY`` não foi implementada para facilitar os testes, mas após o término do processo essas chaves de autenticação serão configuradas para aumentar a segurança da API e evitar dores de cabeça.


# Arquitetura

O projeto foi construído em cima da arquitetura Domain-Driven Design ou Projeto Orientado a Domínio (famoso DDD) que é um padrão de modelagem orientado a objetos (ou módulos).

**🌐 Arquitetura global:**

```shell
|-- frontend/ # Front-end do projeto.
|-- backend/ # Back-end do projeto.
```

<br>

**📁 Arquitetura do back-end:**

```shell
backend/src
|-- configs/ # Configurações do projeto (exemplo: cache, dotenv).
|-- container/ # Arquivos dos repositórios e providers para serem "injetados" no container de injeção de dependência.
|-- errors/ # Classes personalizadas de erros.
|-- infra/ # Contém as rotas, controllers e implementações de repositórios.
  |-- databases/ # Repositórios e entidades de uma ou várias base da dados.
    |-- mongoose/ # Implementação do Mongoose.
      |-- entities/ # Entidades do Mongoose (MongoDB).
      |-- repositories/ # Repositórios do Mongoose (MongoDB).
  |-- http/ # Contém as rotas, controllers e implementações de repositórios.
    |-- controllers/ # Contém as rotas, controllers e implementações de repositórios.
    |-- routes/ # Contém as rotas, controllers e implementações de repositórios.
|-- interfaces/ # Contém os modelos (ou estrutura) de dados.
|-- repositories/ # Modelo de dados, DTOs e fakes dos repositórios.
|-- services/ # Serviços ou regra de negócio da aplicação.
|-- utils/ # Arquivos com funções/lógicas/utilidade que são utilizadas em dois ou mais services.
```

<br>

**📁 Arquitetura do front-end:**

```shell
frontend/src
|-- components/ # Contém os componentes.
|-- functions/ # Onde é abstraido lógicas reutilizaveis.
|-- hooks/ # Contém os contextos utilizados
|-- interfaces/ # Onde são declarados os tipos de dados.
|-- pages/ # Localiza as paginas da aplicação.
|-- services/ # Onde é feito a ponte entre a aplicação e a fonte de dados.
|-- themes/ # Diretório dos estilos globais.
|-- utils/ # Arquivos de útilidade, como constantes e seus tipos
```

<br>

**↔️ Fluxo de requisição:**

De forma abstrata, a aplicação possuí o seguinte fluxo de requisição:

<img src="https://i.ibb.co/yQwBJRk/Fluxo-de-requisi-o-2x-1.png" alt="Fluxo de requisição" width="800"/>

<br>

# Banco de dados

O banco de dados utilizado no projeto foi o MongoDB.

A Aplicação possui apenas uma *collection*, segue ``interface`` abaixo:

```ts
interface Currency {
  code: string;
  backingCurrency: {
    code: 'usd' | 'brl' | 'eur' | 'btc' | 'eth';
    amount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

# Instalação

```sh
git clone https://github.com/ribeirogab/challenge-bravo
```

```sh
cd challenge-bravo
```

## **Rodando o projeto**

As rotas da aplicação podem ser testadas localmente ou em pode seguir uma das três opções descritas a seguir.

Opções:

- [Docker Compose](#docker-compose-recomendada); (recomendada)
- [Manualmente](#manualmente-mais-rápida); (mais rápida)
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

Para ver as instruções de como rodar o projeto manualmente clique [aqui](./docs/RUN.md#manualmente-mais-rápida).

## **Docker run**

Para ver as instruções de como rodar o projeto utilizando ``docker run`` [aqui](./docs/RUN.md#docker-run).

# Testes

## **Rotas**

As rotas da aplicação podem ser testadas localmente com o repositório clonado ou em [**https://challenge-bravo.ribeirogab.me**](https://challenge-bravo.ribeirogab.me) (o servidor está espelhando o código da branch ``main``).

**Requests Collections:**

Caso seja preciso, as *requests collections* para testar as rotas no **Postman** e/ou **Insomnia**, o download pode ser feito clicando na opção desejada:

- [Insomnia](https://drive.google.com/file/d/1mC6l-l-5zg8KXnzOtSJ4pcBKr77rLFUl/view?usp=sharing)
- [Postman](https://drive.google.com/file/d/1HJ5wsOSvZiEESbsT2Bug5kLs810D1PhO/view?usp=sharing)

---

## **Testes unitários**

Com a aplicação clonada e as dependências instaladas, para rodar os testes unitários execute o seguinte comando:

```sh
yarn test
```

**🧪 Cobertura:**

<img src="https://i.ibb.co/JkMBBNq/Screenshot-20210726-044342.png" alt="Cobertura dos testes" width="480"/>


Para visualizar a cobertura dos testes de uma maneira mais intuítiva, acesse o diretório ``challenge-bravo/backend/coverage/lcov-report``.

Esta pasta possuí um arquivo ``index.html``, que ao ser aberto exibirá a cobertura de todos os testes em uma página web.

---

## Contato

Qualquer dúvida, sugestão ou crítica construtiva estarei à disposição! :)

**Muito obrigado!** ❤️

E-mail: **ribeirogabx@gmail.com**

LinkedIn: [**https://www.linkedin.com/in/ribeirogab/**](https://www.linkedin.com/in/ribeirogab/)
