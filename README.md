## Projeto
- Dentro da pasta do projeto execute os seguintes comandos:
  - docker-compose build 
  - docker-compose up -d

## Aplicação
- Endpoint para conversão
  - http://localhost:8081/api/converter
- Exemplo
  - http://localhost:8081/api/converter?to=BRL&from=USD&amount=1

## Testes
- Fora do container
  - docker-compose exec app ./vendor/bin/phpunit
- Dentro do container
  - ./vendor/bin/phpunit

## Arquivos criados
- src/app/Http/Controllers/Api/ConverterCoinController.php
- src/app/Http/Request/ApiRequest.php
- src/app/Services/CryptoCompare.php
- src/app/ConverterCoin.php
- src/tests/Feature/ConverterCoinTest.php


## Tecnologias utilizadas
- Laravel v5.8
- Redis v1.1
