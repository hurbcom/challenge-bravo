# Currency Converter (vlab for [https://hotelurbano.com/](https://hotelurbano.com/))

Um pequeno projeto para testar minhas habilidades.

![frontend-scshot](../master/scshot/frontend-scshot.png)

## Desafio

> ...
>
> Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.
>
> - [X] Conveter entre as seguintes moedas (USD, BRL, EUR, ...)
> - [X] Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um *pull request*.
> - [X] O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
> - [X] Para executar seu código, deve ser preciso apenas rodar os seguintes comandos: git clone $seu-fork, cd $seu-fork, comando para instalar dependências, comando para executar a aplicação.
> - [ ] A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.
>
> ...

## Instalação

### Pré-requisitos

Ter instalado localmente (apenas p/ Desenvolvimento e Teste):
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)

### Instalando dependências

```bash
$ git clone git@github.com:raulpe7eira/currency-converter.git
$ cd currency-converter
$ npm install
```

## Subir & Rodar

### Ambiente de desenvolvimento

```bash
$ npm start
```
![dsv-scshot](../master/scshot/dsv-scshot.png)

### Ambiente de teste

```bash
$ npm test
```

![tst-scshot](../master/scshot/tst-scshot.png)

### Ambiente de produção

Acesse => *[https://currencyconverter-rp.herokuapp.com/](https://currencyconverter-rp.herokuapp.com/)* :clap:

## Considerações

### Plataforma

**[Node.js](https://nodejs.org/)**: Foi uma escolha pessoal, resolvi encarar o desafio com uma plataforma que não tenho experiência profissional, fora que facilitaria ter tanto no backend quanto no frontend, o uso da mesma linguagem em todas as camadas da aplicação.

### Serviço

**[https://openexchangerates.org/](https://openexchangerates.org/)**: Foi escolhido este serviço para consumir as últimas taxas de conversão de moeda, ela já possui por padrão uma moeda de lastro. Como utilizo? Consumo este endpoint e realizo o devido calculo da taxa de conversão para as moedas escolhidas. Além de listar no cliente as moedas possíveis na combo de seleção.

### Backend

#### Web Server

**[Express.js](https://expressjs.com/)**: Foi escolhido pela popularidade e pela vasta gama de material na web, facilitando a meta de cumprir com o prazo de entrega.

### Frontend

**[HTML](https://w3.org/html/)** + **[Bootstrap](http://getbootstrap.com/)**: Como o foco do desafio era o backend, resolvi utilizar o mínimo apresentável para a interface cliente do serviço de conversão.

### Testes

**[Mocha](https://mochajs.org/)** + **[SuperTest](https://github.com/visionmedia/supertest)**: Essa dupla foi utilizada para testar todos os endpoints do backend. Porém ficou faltando realizar os teste para o frontend, além de um teste E2E, necessários para orquestrar todo processo de implantação em ambiente de produção.

### Servidores de produção

**[Heroku](https://heroku.com)** (PAAS): Foi escolhido pela facilidade de uso e seu pacote gratuito. Além de ser facil de integrar com o [GitHub](https://github.com/), que é responsável pelo versionamento do código.

## Conclusão

O desafio foi bem bacana de ser realizado, primeiro desafio foi encontrar um serviço grátis para pegar as taxas de conversão de moeda, testei vários mas a escolha foi decidida pela serviço que possuía a melhor documentação. Usar novamente [Node.js](https://nodejs.org/) em um desafio foi bacana para realizar uma atualização do conhecimento que tenho, por fim, fiquei devendo 3 pontos, são eles: **(1)** Uma cobertura melhor nos testes, principalmente no quesito volume de requisições. **(2)** Uma interface mais elegante e que trate os erros enviados pelo servidor corretamente. **(3)** E não tive tempo para configurar e utilizar uma estrutura em [Docker](https://docker.com/) para a aplicação ser instalada, talvez fosse a maneira adequada para não deixar a chave de acesso ao serviço consumido no [GitHub](https://github.com/), poderia fazer um controle de scripts? Sim, mas a pessoa que irá avaliar teria passos a mais para realizar a instalação.

**AVANTE!** :muscle:
