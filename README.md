# Conversor monetário

Projeto desenvolvido em PHP, Mongo e Redis implementando um conversor de oedas reais e fictícias(que podem ser cadastradas via API)
O projeto foi todo desenvolvido usando PHP puro com a adição de alguns componentes

 - vlucas/phpdotenv - Utilizado para implementar um arquivo .env no projeto para melhor organização de suas variáveis de ambiente
 - guzzlehttp/guzzle - Utilizado para melhor implemtnar requisições Http a api extenra
 - ext-mongodb - Utilizado para configuração no heroku
 - phpunit/phpunit - Biblioeca para implementação de testes unitários

O projeto Utiliza a api https://githubmemory.com/repo/fawazahmed0/currency-api por ser free e sem limite de acessos mensais. E por ter demomstrado acertividade nos testes realizados durante as conversões

O projeto converte de todaas as moedas cadastradas na api e é possivel adicionar moedas no sistema(mediante a passagem de um lastro e um valor de cotação naquel lastro) para se utilizar das mesmas nas conversões.

    Ex.: USD -> EUR
    HER(ficticia) -> EUR
    HER(ficticia) -> ISI(ficticia)


## Instalação

Clone o Repositório

Entre no diretório

> cd %folder%

Gere o arquivo `.env` baseado no `.env.example`

> cp .env.example .env

"Suba" com o container

> docker-composer up -d --build

Instale as dependências utilizando o `composer`
> docker-composer exec php bash -c "composer install"

Configure as variáveis de ambiente no .env
* `DB_` Dados de conexão com o mongo

## Testing

>docker-compose exec php bash -c "./vendor/bin/phpunit tests"

## Utilização

|METHOD|URL                    |EXPLICAÇÃO|
|------|-----------------------|----------|
|GET   |/currency              |lista todas as moedas do sistema
|POST  |/currency/store        |Cadastra Novas moedas
|DELETE|/currency/%name%/delete|Deleta uma moeda
|PUT   |/currency/%name%/update|Edita uma moeda
|GET   |/exange                |Faz conversão monetária entre moedas
