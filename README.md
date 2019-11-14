Oi pessoal, terminei o desafio.

Como solicitado, para rodar o projeto seguem os passos:

- git clone https://github.com/diegodesousas/challenge-bravo
- cd challenge-bravo
- criar o arquivo .env
- docker-compose up (Aguarde a mensagem "Hurb app is fully up on http://localhost:8000" )
- docker-compose composer database:seed
- comece a usar :)

Para rodar os testes
- docker-compose composer test:coverage
Cobertura do código fica no diretório `coverage`  

Arquivo .env
```
APP_NAME=hurb-app
APP_ENV=development
APP_KEY=base64:9DPfV8yMdI+gXWkz1Z5lh94PZ2detg0vuZFZKNHAsQ0=
APP_DEBUG=true
APP_URL=http://localhost
LOG_CHANNEL=stack
DB_CONNECTION=mysql
DB_HOST=hurb-db
DB_PORT=3306
DB_DATABASE=hurb_development
DB_USERNAME=root
DB_PASSWORD=123456
DB_TESTING_DATABASE=hurb_testing
HTTP_CLIENT_EXCHANGE_RATES_URL=https://api.exchangeratesapi.io
HTTP_CLIENT_COIN_API_URL=https://rest.coinapi.io
HTTP_CLIENT_COIN_API_KEY=1F83132A-9371-49E5-9C7D-42A8F0FCD78D
```
