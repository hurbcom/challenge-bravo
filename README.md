<div align="center">
    <img src="https://github.com/ElizCarvalho/challenge-bravo/blob/develop/logo-currency_converter-v2.gif" alt="Currency Converter API" width="400" /> 
</div>

[[English](README.md) | [Portuguese](README.pt.md)]

## About the project
Currency Converter API is a result of the "Challenge-Bravo" challenge, its goal is to convert, with current exchange rates, between different currencies using the American dollar (USD) as the base currency, such as: world currencies (BRL, EUR, LBS, etc), cryptocurrencies (BTC, ETH) and fictitious currencies that can be registered using the API.

As integration partner (API partner) for collecting the quotes of the main currencies/critocurrencies, the api provided by [Coinbase](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates). The choice was due to the following motivations:
- Deliver, at a minimum, the quotes required to cover the functional requirement "Required to perform conversion between the currencies BRL, USD, EUR, BTC, ETH.";
- Allow, when calling your endpoint, to inform the ballast currency so that the quotations can be based on it;
- Have a [rate limit](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/rate-limiting) of 10,000 requests per hour.

The application relies on retentive and circuit breaker policies to provide resiliency, using the Polly library.

For the functional requirement "Also build an endpoint to add and remove API-supported currencies using HTTP verbs", the use of the non-relational database MongoDB was chosen due to the flexible data structure and fast processing. Two indexes were added to improve performance in queries to the database.

Caching using Redis was chosen as the technological decision, in order to decrease the data access time and consequently the number of requests to the partner API, since the list of acronyms and quotations will be cached for a period of **one hour**. 

It was decided not to cache the quotes of the currencies registered in the base, in order to maintain the conformity of the values in the base and reduce the network traffic needed to ensure integrity (in insert, update and delete actions) and given that the speed of access to these is assured with the combination of MongoDB and search indexes.

**Architecture** was **developed in layers** and some design patterns were used such as:
- **Repository**: isolating the data layer from the business and application layers;
- **Circuit Breaker**: tolerance to unavailability failure;
- **Value Object**: send data to the presentation layer without exposing the entities used in database persistence;

To execute, build and publish the API in a container, a *Dockerfile* com [multiplos estágios](https://docs.microsoft.com/pt-br/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-6.0), resulting in an image with a disk size of about 250MB.

## Architectural Mechanisms
| Analysis | Implementation |
| --- | --- |
| API | Restful Web API (Level 2 on the [Richardson maturity scale](https://boaglio.com/index.php/2016/11/03/modelo-de-maturidade-de-richardson-os-passos-para-a-gloria-do-rest/)) |
| Backend | .NET 6 |
| Web Integration | [HttpClientFactory](https://docs.microsoft.com/pt-br/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests) |
| Cache | [Redis](https://redis.io/docs/) |
| Persistence | [MongoDB](https://www.mongodb.com/docs/) |
| Resilience (Await & Retry, Circuit Breaker) | [Polly](https://docs.microsoft.com/pt-br/dotnet/architecture/microservices/implement-resilient-applications/implement-http-call-retries-exponential-backoff-polly) |
| Application Log | [Serilog](https://serilog.net/) |
| Log Viewing | [SEQ](https://docs.datalust.co/docs) |
| Unit Test | [xUnit](https://docs.microsoft.com/pt-br/dotnet/core/testing/unit-testing-with-dotnet-test) |
| Integration Test | [PostmanCollection](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/) |
| Containerization | [Docker](https://docs.docker.com/) |
| Orchestration | [docker-compose](https://docs.docker.com/compose/) |
| Application Metrics | [Prometheus](https://prometheus.io/docs/instrumenting/clientlibs/) |
| Application documentation | [Swagger](https://swagger.io/docs/) |
| DTO | [AutoMapper](https://docs.automapper.org/en/stable/) |
| Integrity | Healtchcheck (incluído no .NET) |
| API Versioning | ApiVersioning (incluído no .NET) |

## Starting

### >Requirement
It is necessary to have [Docker](https://docs.docker.com/get-docker/) installed and running correctly.

### >Running the project
1. Clone the repository
   ```sh
   git clone https://github.com/ElizCarvalho/challenge-bravo.git
   ```
2. Change to the application directory, for example:
   ```sh
   cd .\challenge-bravo\CurrencyConverterAPI
   ```
3. Upload the containers
    ```sh
    docker-compose up -d --build
    ````
4. Access the API documentation via the url `http://localhost:9000`.

5. Access the Postman collection for support and integration testing, available at: `challenge-bravo` `CurrencyConverterAPIPostmanCollection`.

### >Support Containers

For this project the containers were orchestrated with the API:

- **Mongo**: non-relational database MongoDB;
- **Redis**: cache;
- **SEQ**: view the logs generated by the application via the 'Serilog' library;
  - http://localhost:5341`, click [here](http://localhost:5341) to access
  - Use the login credentials: `Username: admin` and `Password: bravo@123`.
- **Prometheus**: view the metrics made available by the application through the `Prometheus` library; 
  - http://localhost:9090`, click [here](http://localhost:9090/graph) to access
  - In the `Expression` field, use the `http_requests_received_total` filter and click the `Execute` button. This allows you to see how many requests have been received so far for each API endpoint.


## Future enhancements
- Use *secrets* for passwords/hashes;
- Database integration tests;
- HATEOS



