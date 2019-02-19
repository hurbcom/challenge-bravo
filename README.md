# Requisitos

  - Docker instalado (https://www.docker.com/products/docker-desktop)

# Setup

Para executar o código, execute os seguintes comandos:

  - git clone git@github.com:brunoguedao/challenge-bravo.git
  - cd challenge-bravo
  - docker-compose up

# Frontend

  - Acesse o seu browser em http://localhost

# API

  - A API retorna um JSON através da chamada http://localhost/api?from=MOEDA&to=MOEDA&amount=VALOR
  - Onde MOEDA pode ser: USD, BRL, EUR, BTC e ETH. Respectivamente, Dólar Americano,Real Brasileiro, Euro, Bitcoin e Ethereum.
  - O valor deve vir no formato 1.00, com as casas decimais separadas por um (.) ponto.
  - O retorno do JSON traz o nome da moeda base e seu símbolo, o nome da moeda alvo e seu símbolo, o valor convertido e a data e hora da conversão no formato timestamp.

# Ambiente de Produção

  - Para testar em um ambiente de produção é só acessar: http://www.imagemvida.com.br/challenge-bravo/ ou http://www.imagemvida.com.br/challenge-bravo/api?from=MOEDA&to=MOEDA&amount=VALOR