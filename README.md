<p align="center"><a href="https://www.hurb.com/br/" target="_blank"><img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" width="200" alt="LaraHurbvel Logo"></a></p>



# Desafio Bravo

O desafio se baseava em criar uma API com retorno em JSON de conversão de moedas. Podendo inclusive criar moedas fictícias.
A API precisa converter entre as seguintes moedas:

- USD
- BRL
- EUR
- BTC
- ETH

Outras moedas podem ser adicionadas conforme o uso.

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

## Linguagem de programação

Escolhi o PHP por ser a liguagem que tive mais contato durante minha carreira como programador e fiz uso do framework Laravel na versão 9

Segue abaixo as pastas e arquivos que criei.

```
- app
    - Console
        - Commands
            - GetUpdatedCurrencyValues.php
        - Kernel.php
    - Helper
        - SingleCurrency.php
    - Http
        - Controllers
            - ConvertController.php
            - CurrencyController.php
        - Requests
            - CurrencyRequest.php
    - Interfaces
        - CrudInterface.php
    - Models
        - Currency.php
    - Repositories
        - CurrencyRepository.php
    - Services
        - CurrencyApiService.php
    - Traits
        - ResponseTrait.php
- database
    - migrations
        - 2023_01_19_182835_create_currencies_table.php
    - seeders
        - DatabaseSeeder.php
- routes
    - api.php
- tests
    - Feature
        - CurrencyTest.php
```

## Para rodar o sistema

Após baixar o sistema, entre na pasta raiz e rode exatamente o seguinte código.

```
docker-compose up -d
```

Rode o seguinte comando para entrar no container da aplicação.

```
docker-compose exec hurb_bravo bash
```

Rode o seguinte comando para cadastrar as dependencias.

```
composer install
```

Por fim rode o seguinte comando

```
php artisan migrate --seed && php artisan schedule:work
```

Para rodas teste

```
php artisan test
```

## Testar a API

Na raiz do projeto estou disponibilizando um arquivo chamado postman.json para testar os endpoints nesta ferramenta caso a utilizem.

Do contrario podem seguir os exemplos

- http://localhost:8180/api/currency (get) Lista as moedas no banco
- http://localhost:8180/api/currency (post) Cria moeda no banco
- http://localhost:8180/api/currency/{id} (put) Altera a moeda no banco
- http://localhost:8180/api/currency/{id} (delete) Deleta a moeda no banco

- http://localhost:8180/api/convert/{FROM}/{TO}/{AMOUNT} (get) Faz a conversão de valores.

Como podem ver, eu criei a rota de conversão com uma URL mais limpa

## Funcionalidade que criei

O codigo tem um recurso que é iniciado logo ao executar o último comando de instalação. O comando que estou me referindo é o "php artisan schedule:work" em que irá buscar pelo arquivo Kernel.php e executar uma função de cron job a cada 1 minuto.

Essa função faz as seguintes etapas

1. Busca no banco de dados todas as moedas verdadeiras
2. Envia essa lista para a API externa que retorna os valores atualizados das moedas
3. Atualiza essa lista de moedas no banco e no Redis

Os usuarios vão consultar dados pelo Redis, evitando queda de meu sistema e de terceiros. Alem de deixar o sistema mais performático e com menos consultas no banco de dados e request externo

## Agradecimento

Só tenho a agradecer a toda equipe Hurb, tenho muita vontade de fazer parte do time e tenho certeza que irei me dedicar ao máximo se eu conseguir a vaga.

Gostaria muito da oportunidade, seja ela júnior, pleno ou sênior. O mais importante pra mim é fazer parte do time e tenho certeza que tenho muito a oferecer e irei me dedicar muito. O que tiver que aprender, ajutar, melhorar irei fazer.

Estarei a disposição para qualquer dúvida.

❤️ Muito obrigado.
