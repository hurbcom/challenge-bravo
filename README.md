<h2 align="center">
    <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo
</h2>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [PHP 7.4](https://php.net)
- [Laravel 8](https://laravel.com)
- [MySQL 5.7](https://mysql.com)
- [Docker](https://docker.com)
- [Redis](https://redis.io)
- [Swagger](https://github.com/DarkaOnLine/L5-Swagger)


## 💻 Projeto

Esse projeto é uma API Restful que responde JSON para conversão monetária. Tem uma moeda de lastro (USD)
e faz conversões entre diferentes moedas com cotações de verdade e atuais.
Foi feita a integração com a API pública  [Free Currency Rates API](https://github.com/fawazahmed0/currency-api),
que entrega cotações de verdade e atuais sem limitação de requisições.

## ⚙️ Instalação e execução
Clone o projeto para o seu ambiente.
Para executá-lo, digite o comando abaixo na pasta do projeto.
Todas as dependências serão instaladas automaticamente durante a criação dos containers.
```sh
docker-compose up -d
```

## Acessar a Aplicação - http://localhost:8000
Como se trata de uma API RESTful, acessar os endpoints através do Postman ou outro API Client.
Os endereços dos Endpoints estão descritos na documentação.
- Listagem de todas as moedas - http://localhost:8000/api/v1/currencies (GET)
- Listagem de apenas uma moedas - http://localhost:8000/api/v1/currencies/id (GET)
- Adição de nova moeda - http://localhost:8000/api/v1/currencies (POST)
- Remoção de moeda - http://localhost:8000/api/v1/currencies/id (DELETE)
- Conversão de moedas - http://localhost:8000/api/v1/currencies/convert-amount?from=BTC&to=EUR&amount=123.45 (GET)

A documentação apresenta detalhes dos endpoints.

## 📝 Documentação - http://localhost:8000/api/documentation
A documentação que descreve a API RESTful desenvolvida neste projeto pode ser acessada em http://localhost:8000/api/documentation
Esta documentação foi produzida utilizando o Swagger e apresenta em detalhes cada Endpoint, podendo inclusive consumí-los
diretamente pela documentação para fazer alguma requisição.

## 🚀 Funcionalidades usadas nesta aplicação
- Migrations, Factories, Seeders, Resources, Mutators, Cache.
- Para melhorar a performance da API, os resultados das requisições de cotação à API externa ficam em Cache no Redis.
- Conforme requisitos a API, originalmente, faz conversão entre 5 moedas específicas.
- Para tal, executando `docker-compose up -d` pela primeira vez, o `docker-compose.yml` irá executar` php artisan migrate --seed`
que criará a tabela Currencies no banco de dados já com as moedas USD, BRL, EUR, BTC, ETH.

## Base de dados
- MySQL
- Eloquent ORM para trabalhar com uma base de dados, onde as tabelas têm um "Modelo" correspondente que se utiliza para interagir com essa tabela.

## Design Pattern
- **Repository Design Pattern** para separar o acesso aos dados (Repositories) da lógica de negócios (Service Layers).
Com este padrão temos uma divisão de responsabilidades,
  deixando cada camada da aplicação o mais simples possível, contribuindo para a aplicação ser escalável mais facilmente.
- **Strategy** para organizar e separar o uso de um HttpClient para consumir uma API externa, padronizando a usabilidade
das classes, de forma que novas implementações possam ser adicionadas no futuro. Neste projeto, o Curl está sendo usado, mas, caso haja
necessidade de utilizar o Guzzle, basta apenas criar uma nova classe que implemente a interface com o método utilizando o Guzzle e alterar o bind feito entre
a interface HttpClient e a nova classe.

**PS.:** Também foi utilizado neste projeto os princípios do SOLID e DRY.

## Versionamento
- Foi utilizado como prefixo nos endereços dos endpoints `/api/v1` para permitir o desenvolvimento e publicação de uma nova versão desta API através
  do endereço com prefixo `api/v2`, por exemplo, e não impedir o acesso a versão anterior até que seja seguro descontinuá-la.

## 💻 Recursos da API
A API RESTful permite:
- Adição/Remoção de moedas reais e fictícias.
- Moeda de Lastro (USD) com valor equivalente para permitir conversões de moedas fictícias. Ex.: 1 HURB equivale 3 USD
- Listagem de moedas.
- Faz conversões entre diferentes moedas verídicas e fictícias.
- Suporta conversão entre moedas verídicas e fictícias.

## ⚙️Testes Automatizados
Os testes cobrem adição, remoção, consulta de moedas e requisições de conversão.
Ex.:
- Teste para conversão entre duas moedas reais - USD -> BRL
- Teste para conversão entre uma moeda real e uma fictícia - EUR -> HURB
- Teste para conversão entre uma moeda fictícia e uma real - PSN -> BTC
- Teste para conversão entre duas moedas fictícias - HURB -> PSN

Para executar os testes, execute un dos comandos abaixo dentro da pasta do projeto:
```sh
docker-compose exec app vendor/bin/phpunit
docker-compose exec app php artisan test
```

## ⚙️Testes de Estresse
Foi utilizada a ferramenta [jmeter](http://jmeter.apache.org/download_jmeter.cgi) para testes de estresse tanto
desta API quanto da API externa para consulta das cotações.

## 📝 Códigos Próprios

Foi utilizato o Laravel para desenvolver este projeto. Abaixo arquivos criados por mim:
- Pasta .docker
- Pasta app\Repositories
- Pasta app\Services
- Pasta app\HttpClient
- Pasta api\docs
- Pasta Tests\Features\Api
- Pasta Tests\Unit\Api

Arquivos gerados com o artisan, mas tendo o conteúdo com código escrito por mim.
- Model Currency
- Routes API
- Migration Currency
- Factory
- Seeder
- CurrencyController
- RepositoryServiceProvider
- HttpClientServiceProvider
- CurrencyRequest
- ConvertRequest
- CurrencyResource

Desenvolvido por Thiago Luna: [Linkedin!](https://www.linkedin.com/in/thiago-luna/)


