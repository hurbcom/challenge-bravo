# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

## Victor de Nápoles
<https://www.linkedin.com/in/victor-n%C3%A1poles-84b61a32/>

### API de conversão de moedas

A API executa a conversão de modeadas fiduciárias, crypto e ficticias, desde que cadastrada previamente, com excessão das USD, BRL, EUR, BTC e ETH que já se encontram cadastradas.

### Arquitetura

A linguagem utilizada foi o golang em conjunto com o framework gin e o swaggo. Foi utilizado o banco de dados MongoDB e para cache o Redis.

Inicialmente foi utilizado o Postgres, mas por dificuldade de excutar o serviço no ambiente em docker, ele foi substituido pelo MongoDB.

É utlizado uma api externa para a cotação de modedas em tempo real. A api utilizada é a AwesomeApi.(<https://docs.awesomeapi.com.br/api-de-moedas>)

A aplicação, o banco e o cache estão rodando no ambiente docker.

### Estrutura de código

O código está separa em camadas. E foi escolhido a arquitetura limpa para a organização. O código está separado nas pastas:
-   **Infra**: Classes responsáveis pelas conexões de banco, cache e api externa.
-   **Domain**: Classes que representam os domínios da aplicação.
-   **Gateway**: Classes responsáveis pelas operações de banco e cache e requisições para a API externa.
-   **Usecase**: Classes responsáveis pelas regras de negócio.
-   **Presenter**: Classes responsáveis por receber as requisições.


### Execução do projeto

Para executar o projeto, basta executar os comandos abaixo:

```
$ git clone https://github.com/VictorNapoles/challenge-bravo.git
```

```
$ cd challenge-bravo
```

```
$ docker-compose up -d
```

### Documentação da API

A documentação da API pode ser acessado através da url: <http://localhost:8080/swagger/index.html>