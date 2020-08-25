# Overview

-   [Sobre a arquitetura](./ARCHITECTURE.md)
-   [Sobre as tecnologias](./TECHS.md)

Ao receber a proposta de desafio, a primeira coisa que reparei foi o prazo. O prazo é importante pois junto com a complexidade do projeto me auxiliaria a definir [as ferramentas](./TECHS.md) à serem utilizadas e a [arquitetura](./ARCHITECTURE.md).

O prazo fornecido foi de 10 dias para completar o projeto, portanto, me planejei dentro destes 10 dias com os seguintes focos:

-   Planejamento - Pensei em dedicar o primeiro dia apenas à isto, assim como fazemos no Scrum
-   Estruturação/Implementação da arquitetura - Durante o planejamento, defini a arquitetura. Por experiências prévias, eu sabia que a arquitetura poderia demandar um maior tempo para escrita. Portanto, coloquei um prazo máximo de 3 dias para a mesma.
-   Implementação da solução/Automatização do ambiente - 3 dias
-   Escrita de testes/documentação - 2 dias
-   Refatorações ou melhorias - 1 dia

Obviamente, dentro dos prazos estabelecidos, busquei uma flexibilidade de forma que mantesse a qualidade geral do projeto. Ou seja, não segui à risca os prazos, porém ao definir-los, eu conseguia ter uma abordagem melhor sobre o que eu teria um foco maior.

Então, comecei a solucionar o problema. Eu utilizo um computador com Windows, portanto, o primeiro detalhe importante que foquei foi o uso de ferramentas multiplataforma. Um dos exemplos é o **cross-env**, que utilizei para poder settar as variáveis no PATH conforme o O. S. necessitava. Também busquei configurar um ambiente Docker para permitir um rápido teste de outros desenvolvedores.

O primeiro problema encontrado foi encontrar um serviço que disponibilizasse uma API com taxas de conversão, que aceitasse tanto moedas comuns (EUR, USD, BRL) quanto criptomoedas (BTC, ETH). Para isto, usei o [CryptoCompare](https://min-api.cryptocompare.com).

O segundo problema foi a performance. Visto o grande volume de requisições por segundo, eram necessários clusters, para dividir a carga da aplicação, e também um sistema de caching potente que suportasse tamanhas requisições. Para o caching, optei por usar Redis. [Este artigo](https://www.infoworld.com/article/3063161/why-redis-beats-memcached-for-caching.html) explica um pouco minha escolha do Redis sobre o memcached, porém o fator principal foi que o volume de dados em cache não seria tão grande, permitindo então que o Redis tivesse performance superior ao memcached.

O terceiro problema era formatação do valor. Criptomoedas utilizam valores muito pequenos, e isto pode fazer com que ocorram problemas de conversão com valores muito baixos. Para estes casos, resolvi manter o valor padrão (Por exemplo, caso seja 0.0000000434314341, invés de arredondar para 0, mantive o 0.0000000434314341).

---

-   [Sobre a arquitetura](./ARCHITECTURE.md)
-   [Sobre as tecnologias](./TECHS.md)

[Retornar ao README](../README.md)
