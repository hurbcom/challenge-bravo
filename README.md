# Challenge Bravo

Esse é um teste que me avaliará para o cargo de desenvolvedor.
O teste consiste no desenvolvimento de uma api para conversão monetária nas seguintes moedas: 

- USD
- BRL
- EUR
- BTC
- ETH

## Tecnologias usadas

- PHP
- Framework Laravel
- Composer
- Git
- Docker

## Configurações

1 - Clonar projeto do git

2 - Rodar o build do docker

    docker build -t challenge-bravo:1.0 -t challange-bravo:latest .
    
3 - Executar a imagem do docker

    docker run -p 8081:80 challenge-bravo 


Exemplo da chamada da api: 

    http://localhost:8081/api/convert?from=USD&to=BRL&amount=1.1
  
