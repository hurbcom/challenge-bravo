<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Sobre

O sistema tem o objetivo principal de criar uma api que converta valores monetários  entre cambios diferentes.
`Ex: ?from=BTC&to=EUR&amount=123.45`

Para converter BTC (Bitcoin) para EUR (Euro). As moedas aceitas por padrão são as seguintes:

- USD
- BRL
- EUR
- BTC
- ETH

Mas se a que você procura não esta ai você pode adicionar, para isso basta acessar a api usando o padrão REST no endpoint 
`	 /currencies`
Por exemplo, para inserir a moeda GTA Dolar, isso mesmo você também pode usar moedas fictícias! Envie uma requisição POST contendo os seguintes dados:
```json
{
	"st_short_name": "GTA",
	"st_descrtption": "GTA Dollar"
}
```
E para inserir a cotação de forma manual você pode usar o end point:
`/quotations`
No caso da nossa moeda do GTA precisamos informar quanto ela vale, para isso basta enviar uma requisição POST contendo a sua cotação:
```json
{
	"currency_id": 6,
	"dt_quotation": "2021-06-15",
	"value": 75757.575757575757576,
	"st_lastro": "USD",
	"fictional": true
}
```

Ao inserir a moeda, no caso GTA, você receberá informações sobre o id, mas caso você não tenha gravado, pode acessar o endpoin GET `/currencies` e ver a lista de todas as moedas.

Mas quanto vale o GTA? Vamos encontrar a equivalência para do USD (Dolar americano) para que nossa api consiga converter para qual quer uma das moedas cadastradas. Na Playstation Store [Loja Virtual] você pode comprar GTA $1.250.000,00 por R$ 83,50 (https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D), 
BRL 83,5 equivalem a USD 16,60 logo GTA $ 1.250.000,00 equivalem a USD 16,60.
Se dividirmos o valor do GTA por sua equivalência em dolar saberemos quantos GTA precisamos para converter em USD 1 o que na cotação do dia 16/06/2021 é **75757.575757575757576** e é esse valor que você vai informar no parâmetro "value" quando informar a cotação da usa moeda GTA. Pronto, agora você já pode saber quanto dinheiro  você teria na vida real depois de cumprir todas as suas missões!

## Requisitos

- Docker
- Docker-compose
- Composer
- PHP 8.0+

## Instalação 
Após fazer clonar o projeto acesse a pasta do projeto pelo terminal em seguida execute `./install.sh` para instalar o projeto, após o termino execute `./run.sh` para iniciar. A api ficará disponível na porta 8000

### Dificuldades

Aqui gostaria de explicar rapidamente as dificuldades e falhas do projeto. Estou envolvido em outros projetos e tenho trabalhado 12 horas por dia, por isso nos prazos que me foi passado só consegui dedicar cerca de 10 horas ao projeto, então algumas etapas eu não consegui me dedicar tanto quanto eu gostaria,
1. Validações, a api esta frágil.
2. Armazenar os dados em sessões para diminuir o numero de consultas ao banco.
3. Docker, não tive tempo suficiente para criar o contêiner que receberia a aplicação.

## Contato
Em caso de dúvidas estou a disposição.([aureliomoreirared@gmail.com](mailto:aureliomoreirared@gmail.com "aureliomoreirared@gmail.com"))