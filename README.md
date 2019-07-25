# Projeto

Projeto do desafio da HURB

# Autor

Rodrigo Marques - marques.coti@gmail.com

# Pré-Requisitos
PHP 7.1\
Apache\
Docker Opcional

Foi utilizado no projeto o GraphQL com o PHP para gerar as APIs

# Instalação

composer install  
docker-composer run

Alterar o arquivo .env com os dados de conexão com o mysql\
DB_CONNECTION=mysql\
DB_HOST=127.0.0.1\
DB_PORT=3306\
DB_DATABASE=hurbdb\
DB_USERNAME=root\
DB_PASSWORD=

php artisan migrate

# Test
php artisan migrate --database=testing

vendor/bin/phpunit

# Querys
Fazer uma requisição do tipo POST com as querys como parametros, programa recomendado:\
Altair\
Postman
### Query de verificação do projeto
query{
  currentVersion
}

### Query de conversão de moeda
query{
  convertCurrency(from: "USD", to: "BRL", amount: 100)
}