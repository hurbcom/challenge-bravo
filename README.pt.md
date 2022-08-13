<div align="center">
    <img src="https://github.com/ElizCarvalho/challenge-bravo/blob/develop/logo-currency_converter-v2.gif" alt="Currency Converter API" width="400" /> 
</div>

[[English](README.md) | [Português](README.pt.md)]

## Sobre o projeto
Currency Converter API é resultado do desafio "Challenge-Bravo", seu objetivo é realizar conversão, com cotação atual, entre diferentes moedas utilizando dólar americano (USD) como moeda lastro, tais como: moedas mundiais (BRL, EUR, LBS, etc), criptomoedas (BTC, ETH) e moedas ficticias que podem ser cadastradas utilzando a API.

Como parceiro de integração (API parceira) para coleta das cotações das principais moedas/critomoedas foi escolhida a api disponibilizada pela [Coinbase](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates). A escolha foi decorrente foi decorrente das seguintes motivações:
- Entregar, no mínimo, as cotações necessárias para cobrir o requisito funcional "Necessário realizar conversãot entre as moedas BRL, USD, EUR, BTC, ETH."; 
- Permitir, na chamada do seu endpoint, que seja informada a moeda lastro para que as cotações seja em função desta;
- Possuir um [rate limit](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/rate-limiting) de 10 mil requisições por hora.

A aplicação conta com políticas de retentativa e circuit breaker para oferecer resiliência, com o uso da biblioteca Polly.

Para o requisito funcional "Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.", foi escolhido o uso de banco não relacional MongoDB devido a estrutura flexivel do dado e rápido processamento. Foram acrescentadas dois índices para melhorar o desempenho nas consultas à base.

Como decisão técnológica foi escolhido o uso do cache utilizando Redis, a fim de dminiuir o tempo de acesso aos dados e por conseguência o número de resições a API parceira, uma vez que os acrônimos e a lista de cotações ficarão armazenadas em cache durante o período de **uma hora**. 

Foi decidido não armazenar em cache as cotações das moedas cadastradas na base, a fim de manter a conformidade dos valores mesmas na base e reduzir o tráfego de rede necessário para garantir a integridade (em ações de inserção, atualização e deleção) e tendo em vista que a velocidade de acesso a estes está assegurada com a combinação MongoDB e íncides de busca.

**Arquitetura** foi **desenvolvida em camadas** e foram utilizadas alguns padrões de projeto como:
- **Repository**: isolar a camada de dados, das camadas de negócio e aplicação;
- **Circuit Breaker**: tolerância a falha de indisponibilidade;
- **Value Object**: enviar para camada de apresentação sem expor às entidades utilizadas na persistência em base de dados;

## Mecanismos Arquiteturais
| Análise | Implementação |
| --- | --- |
| API | Web API Restful (Nível 2 na [escala de maturidade "Richardson"](https://boaglio.com/index.php/2016/11/03/modelo-de-maturidade-de-richardson-os-passos-para-a-gloria-do-rest/)) |
| Backend | .NET 6 |
| Integração Web | [HttpClientFactory](https://docs.microsoft.com/pt-br/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests) |
| Cache | [Redis](https://redis.io/docs/) |
| Persistência | [MongoDB](https://www.mongodb.com/docs/) |
| Resiliência (Await & Retry, Circuit Breaker) | [Polly](https://docs.microsoft.com/pt-br/dotnet/architecture/microservices/implement-resilient-applications/implement-http-call-retries-exponential-backoff-polly) |
| Log da aplicação | [Serilog](https://serilog.net/) |
| Visualização de logs | [SEQ](https://docs.datalust.co/docs) |
| Teste unitário | [xUnit](https://docs.microsoft.com/pt-br/dotnet/core/testing/unit-testing-with-dotnet-test) |
| Teste de integração | [PostmanCollection](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/) |
| Containerização | [Docker](https://docs.docker.com/) |
| Orquestração | [docker-compose](https://docs.docker.com/compose/) |
| Métricas da aplicação | [Prometheus](https://prometheus.io/docs/instrumenting/clientlibs/) |
| Documemtação da aplicação | [Swagger](https://swagger.io/docs/) |
| DTO | [AutoMapper](https://docs.automapper.org/en/stable/) |
| Integridade | Healtchcheck (incluído no .NET) |
| Versionamento de API | ApiVersioning (incluído no .NET) |


## Iniciando

### >Pré requisito
Faz-se necessário ter o [Docker](https://docs.docker.com/get-docker/) instalado e funcionando corretamente.

### >Executando o projeto
1. Clone o repositório
   ```sh
   git clone https://github.com/ElizCarvalho/challenge-bravo.git
   ```
2. Acesse o diretório da aplicação, por exemplo:
   ```sh
   cd .\challenge-bravo\CurrencyConverterAPI
   ```
3. Suba os containers
    ```sh
    docker-compose up -d --build
    ````
4. Acesse a documentação da API através da url `http://localhost:9000`

5. Acesse a coleção do Postman como apoio e teste de integração, disponível em: `challenge-bravo\CurrencyConverterAPI\PostmanCollection`

### >Containers de apoio

Para este projeto foram orquestrados junto à API, os containers:
- **Mongo**: base de dados não relacional MongoDB;
- **Redis**: cache;
- **SEQ**: visualização dos logs gerados pela aplicação através da biblioteca 'Serilog';
  - `http://localhost:5341`, clique [aqui](http://localhost:5341) para acessar
  - Utilize os dados de acesso: `Username: admin` e `Password: bravo@123`.
- **Prometheus**: visualização das métricas disponibilizadas pela aplicação através da biblioteca 'Prometheus'; 
  - `http://localhost:9090`, clique [aqui](http://localhost:9090/graph) para acessar
  - No campo `Expression` utilize o filtro `http_requests_received_total` e clique no botão `Execute`. É possível, com isso, verificar a quantidade de requisições realizadas até o momento para cada endpoint da API.


## Futuras Melhorias
- Utilizar *secrets* para passwords/hashs;
- Testes de integração com base de dados;
- HATEOS
