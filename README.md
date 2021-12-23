# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge


Rotas contidas no projeto:
```
[GET] http://URL/ (rota princial)
[GET] http://URL/currencies (lista todas as moedas cadastradas)
[POST] http://URL/currencies (cria uma nova moeda)
[GET] http://URL/currencies/{code} (retorna uma moeda a partir do código)
[DELETE] http://URL/currencies/{code} (remove uma moeda a partir do código)
[GET] http://URL/currencies/convert (converte um valor entre moedas)
# Extra:
[GET] http://URL/api-docs (documentação swagger)
```

Encontra-se na raiz do projeto o arquivo insomnia_request.json já configurado com as requests e os envs para nodejs e php.
<img src="insomnia.png">

## Projetos:
NodeJS - principal

PHP - Extra

----------

## Incializando o mongo e redis
```sh
docker compose up
```

### Rodando o projeto manulamente com nodejs http://localhost:3000
Inicializar mongodb e redis:
```sh
docker compose up
```
Acesse a pasta com o projeto em node:
```sh
cd nodejs
```
Instalar as dependências:
```sh
npm i
```
Iniciar o serviço:
```sh
npm run start
```
----------
### Rodando o projeto com php http://localhost:3001/api
Inicializar mongodb e redis:
```sh
docker compose up
```
Acesse a pasta com o projeto em php:
```sh
cd php-laravel
```
Criando o .env:
```sh
cp .env.example .env
```
Instalar as dependências:
```sh
composer install
```
Iniciar o serviço:
```sh
php artisan serve --port=3001
```
----------
#### Caso necessite buildar as imagens separadamente
NodeJS
```sh
docker build . -t php -f Dockerfile
```
PHP
```sh
docker build . -t php -f php.Dockerfile
```