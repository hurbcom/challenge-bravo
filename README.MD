# **Test Hurb** 

### Problema:


`Criar uma api que faça conversões monterárias com base em uma moeda comum, o dolar para isso
era preciso encontrar uma api externa que retornasse as cotações e para isso tive a dificuldade de encontrar uma única
api que retornasse todas as cotações requisito, então encontrei uma interessante que além das cotações de forex também 
oferesse as de crypto, porém a mesma apresenta a seguinte limitação 100 requests diárias.
`
<https://www.coinapi.io/>

`Para contonar esse problema da limitação e também dada a natureza flutuante das cotações decidi adotar o redis um banco
não relacional de cache em memória, o que me possibilita uma grande velocidade de acesso e a liberdade de inserir itens 
com tempo de expiração, dada também essa limitação de 100 requests, o endpoint de inserir novas cotações só aceitam
moedas específicas, já que a api em si ao iniciar atualiza o banco com mais de 3000 cotações, entre moedas e crypto`

### Libs utilizadas

* Flask - Framework leve e bem flexível principalmente para criação de micro serviços que interagem com bancos não relacionais
* Redis - Interface para o banco de dados
* pytest, pytest-mock, pytest-cov, mock, tox - Suite para testes unitários com sistema de mocks, e geração de relatórios de coberturas utilizando o tox como orquestrador 
* waitress - Servidor wsgi para a aplicação python, gerencia threads e fila de espera para a api

### Documentação da API 

<https://documenter.getpostman.com/view/16081921/TzY6AujA>

### Testes unitários 
seguir os seguintes comandos:

`python -m pip install -r requirements.txt`

`python -m tox`

### Execução da api 
#### docker redis DB:
`docker run -d -p 6379:6379 --name redis_db redis`
#### API:
`docker build -t testehurb . && docker run -p 5000:5000 --name testehurb-container --link redis_db testehurb`

