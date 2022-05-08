# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

[[English](README.md) | [Português](README.pt.md)] 

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com **cotações de verdade e atuais**. Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP. A API precisa contemplar cotações de verdade e atuais através de integração com APIs públicas de cotação de moedas. Mais detalhes em [challenge-bravo](https://github.com/hurbcom/challenge-bravo)


## Currency-Conversion
Foi desenvolvido uma aplicação para conversão monetária de moedas reais (incluindo criptomoedas) e fictícias, de acordo com os requisitos do desafio. A aplicação consiste de:
  - API Web - Feito em [ASP.NET Core 6.0](https://dotnet.microsoft.com/en-us/apps/aspnet), expões rotas para conversão e operações de CRUD de moedas.
  - Base de dados - Foi utilizado o sistema de banco de dados [PostgreSQL](https://www.postgresql.org/) para persistência das informações de moedas.
  - Tarefa de segundo plano - Feito em [.NET 6.0](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6). Progama em execução permanente, com uma rotina intermitente de alimentação de cotações reais na base de dados.


# aAs
asdas
  
Foi utilizado uma API do [CoinBase](https://developers.coinbase.com/api/v2#exchange-rates) para alimentação de cotações reais. 

