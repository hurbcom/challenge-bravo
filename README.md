<p align="center"><img src="https://res.cloudinary.com/dtfbvvkyp/image/upload/v1566331377/laravel-logolockup-cmyk-red.svg" width="400"></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## Sobre a API

Desenvolvimento de uma API REST para Gerenciar Pedidos de clientes e também foi desenvolvido o Front-END para consumir a API desenvolvida. Foi utilizado as seguintes tecnologias abaixo:

- PHP 7.4
- Laravel 7.1
- MariaDb
- JSON
- HTTP 1.1

## Processo de instalação

- Fazer uma cópia do arquivo .env.example e salvar como .env
- Criar um vhost em seu servidor para a pasta public do projeto
- Criar um database chamado currency_converter, com charset utf8 e collation utf8_unicode_ci
- Executar o comando php artisan migrate
- Executar o comando php artisan db:seed


## Utilização dos EndPoints

- **ENDPOINT - Currency**
- Listagem de todas as moedas cadastradas    
**GET**  http://seuservidor/api/v1/currency  

- Busca Personalizada: trazer apenas determinados campos  
**GET**  http://seuservidor/api/v1/currency?fields=id,name  
**CAMPOS**  
fields = informar todos os campos que desejar separados por virgula  

- Busca Personalizada: fazer busca parcial usando controladores como: =, >=, <=, like  
**GET**  http://seuservidor/api/v1/currency?coditions=name:like:u%;id:>=:10  
**CAMPOS**  
coditions = esse campo recebe todas as condições que desejar fazer, no exemplo acima a api irá retornar todos as moedas que iniciam com "u" e que o id seja maior ou igual a 10  

**OBS** É possível fazer a busca parcial informando os dois campos juntos: fields e coditions  

- Cadastrar Moeda
**POST**  http://seuservidor/api/v1/currency  
**CAMPOS**  
name = nome da moeda  

- Excluir Moeda  
**DELETE**  http://seuservidor/api/v1/currency/#ID  
**CAMPOS**  
#ID = Id da Moeda que deseja-se excluir  

- Converter Moeda  
**POST**  http://seuservidor/api/v1/currency/convert  
**CAMPOS**  
#from = Sigla da Moeda que de referência  
#to = Sigla da Moeda que será convertida  
#amount = Multiplicador   

### Moedas Suportadas
Laravel Exchange Rates supports working with the following currencies (sorted in A-Z order):

| Code | Currency Name         |
|------|-----------------------|
| AUD  | Australian dollar     |
| BGN  | Bulgarian lev         |
| BRL  | Brazilian real        |
| CAD  | Canadian              |
| CHF  | Swiss franc           |
| CNY  | Chinese yuan renminbi |
| CZK  | Czech koruna          |
| DKK  | Danish krone          |
| EUR  | Euro                  |
| GBP  | Pound sterling        |
| HKD  | Hong Kong dollar      |
| HRK  | Croatian kuna         |
| HUF  | Hungarian forint      |
| IDR  | Indonesian rupiah     |
| ILS  | Israeli shekel        |
| INR  | Indian rupee          |
| ISK  | Icelandic krone       |
| JPY  | Japanese yen          |
| KRW  | South Korean won      |
| MXN  | Mexican peso          |
| MYR  | Malaysian ringgit     |
| NOK  | Norwegian krone       |
| NZD  | New Zealand dollar    |
| PHP  | Philippine peso       |
| PLN  | Polish zloty          |
| RON  | Romanian leu          |
| RUB  | Russian rouble        |
| SEK  | Swedish krona         |
| SGD  | Singapore dollar      |
| THB  | Thai baht             |
| TRY  | Turkish lira          |
| USD  | US dollar             |
| ZAR  | South African rand    |