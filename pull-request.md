Your name: Felipe de Paula do Nascimento
Your Github homepage: https://github.com/felipepnascimento
Original challenge URL: https://github.com/hurbcom/challenge-bravo/pulls/ID_DO_PR

## Running the application
Prefer docker to run this app

1. Run `docker-compose up` in the main folder of this app
2. See `challenge_bravo_flp_app` and `challenge_bravo_flp_db` running in your local docker.

## Running the tests

1. Run `docker-compose exec app bash`
2. Run `make test` and see the results


# TODOS
- Fazer um if para buscar pela API ou não (DIFICIL)
    - codar o bypass, quando a moeda não existir na API de conversão, baseado no exchange_api
- fazer o teste de stress
    - melhorar o código, pois não passou.
- Colocar um linter no projeto
- Colocar o swagger na API
- tentar expor o test coverage (opcional)
- Escrever o readme de entrega
    - Especificar como rodar o teste de stress