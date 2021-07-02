# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

##Escolha Técnica
Versão do Python é a 3.8
Versão do Django é a 3.2.5
Versão do Django REST Framework é a 3.12.4

A aplicação foi desenvolvida com Django REST Framework
O banco de dados em postgreSQL
A documentação foi desenvolvida em Swagger
O servidor de aplicação é ngnix e Gunicorn
A aplicação roda em três containers Docker, "back" com o django REST Framework, servidor Gunicorn e todo o código da aplicação na porta 8000, um
container "web" e ngnix na porta 80 e o container "postgres" para o banco de dados.
Dentro do projeto existe o um diretório "app" com as configuraçãos da aplicação, um diretório "core" com as rotas e rotinas comuns, um diretório "coin"
onde está o CRUD das moedas e um diretorio "convert" onde está a lógica da conversão de moedas.

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
Existe um exemplo de payload de cadastro no diretŕio "postman_payload", que poderá ser impotando para o seu Postman

OBS: Existem dois metodos de update, uma que atuliza uma lista de payload e outro que atualiza apenas uma moeda pelo seu id

#Documentação
sh docke.sh
Para ver a documentação da API acesse http://localhost:9000/

## Como iniciar a aplicação
para iniciar a aplicação rode no terminal o comando "sh upDev.sh", este arquivo chama o docker-compose e sobe os containers docker

Os container podem ser parados usando o comando sh stop.sh e iniado novamente com o comando sh start.sh, o comando upDev.sh cria e recria toda a estrutura de containers.

OBS: Pode ser que seja necessário parar o postgres na sua maquina local ou outra aplicação que use as portas 5432 e 8000

Os container podem demorar uns 20 segundos para subir e rodar a aplicação completa, mesmo com os conatainer em up, o Gunicor pode ainda estar subindo dentro do container.

Apos subir a aplicação rode a requisição POST localhost:8000/api/v1/coin/create/ com as moedas inicias que podem ser importadas pelo arquivo no diretório
postman_payload

##rodar os testes
sudo docker-compose exec back python3 manage.py test

##O que faltou ou deveria melhorar
Não possui sistema de autenticação
Maior cobertura de testes
Uma melhor organização dos container, separar o Gunicor em um container separado por exemplo


