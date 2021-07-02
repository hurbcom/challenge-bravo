# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

##Escolha Técnica
A aplicação foi desenvolvida com Django Rest Framework
O banco de dados em postgresql
A documentação foi desenvolvida em Swagger
O servidor de aplicação é ngnix e gunicorn
A aplicação roda em três containers Docker, "back" com o django rest framework, servidor gunicor e todo o código da aplicação na porta 8000, um
container "web" e ngnix na porta 80 e os "postgres" para o banco de dados
Dentro do projeto existe o um app com as configuraçãos da aplicação, um diretório core com as urls, e rotinas comuns , o diretorio coin
onde está o CRUD e por um diretorio convert onde está a lógica da conversão de moedas.

##como a aplicação funciona
Toda moeda precisa ter um lastro, neste caso o lastro padrão é o USD, portanto ao cadastrar uma nova moeda ela deve ser lastreada na moeda USD,
as moedas podem ter lastros diferentes, mas pra isso é necessário informar qual vai ser o seu lastro no payload do post do cadastro.

exemplo do cadastro de uma moeda com lastro no USD:
         {
            "coin": "EURO",
            "coin_initials": "EUR",
            "amount_coint_bslt": 1,
            "price": 1.18,
            "country": "EUROPEN UNION",
            "country_initials": "EU",
            "bslt": "USD"
        },
Existe um exemplo de payload de cadastro no diretŕio postman_payload, que poderá ser impotando para o Postman

#Documentação
Para ver a documentação da API acesse
http://localhost:8000/

## Como iniciar a aplicação
para iniciar a aplicação rode no terminal o comando, este arquivo chama o docker-compose e sobre os containers docker
sh upDev.sh

Os container podem ser parados usando o comando sh stop.sh e iniado novamente com o comando sh start.sh, o comando upDev.sh cria e recria toda a estrutura de containers.

OBS: Pode ser que seja necessário o postgres na maquina local ou outra aplicação que use as portas 5432 e 8000

Os container podem demorar uns 20 segundos para subir e rodas a aplicação

Apos subir a aplicação rode a requisição POST localhost:8000/api/v1/coin/create/ com as moedas inicias que pode ser importada pelo arquivo no diretprio
postman_payload



##rodar os testes
sudo docker-compose exec back python3 manage.py test


