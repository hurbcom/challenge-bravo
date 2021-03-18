## Challenge Bravo API

API construida para converter valores entre moedas diferentes utilizando seus "simbolos"

## Endpoints

- GET converter/
    Endpoint para converter as moedas usando a api https://exchangerate.host/#/ e salvar a cotação no banco de dados para consultas no mesmo dia. Exemplo: http://localhost:8000/converter/?from=BRL&to=USD&amount=1

    - from: a moeda que está querendo converter;
    
    - to: moeda que se quer convertida;

    - amount: o valor para conversão;


- POST gerenciar-moedas/
    Endpoint para cadastrar uma nova moeda (simbolo) usando um json no body. Exemplo:{'simbolo':'KWR'}

- DELETE gerenciar-moedas/
    Endpoint para deletar uma moeda (simbolo) existente usando um body json. Exemplo:{'simbolo':'BTC'}

## Rodar aplicação

Para rodar a aplicação só é preciso um comando:
    
    'docker-compose up --build'

Todo banco de dados e instalação de depêndencias está incluso em configuração no arquivo entrypoint.sh

## Testes

Para os testes unitários da aplicação só é necessário rodar o comando:

'docker-compose run web coverage run manage.py test -v 2'

## Stack Utilizada   
    
Foi utilizado no projeto Django com Django REST Framework para toda parte de API e acesso ao banco de dados.Assim deixando o densenlvimento mais rápido e o foco maior nas funções específicas da API. 

Banco de dados PostgreSQL por sua compatibilidade com django e vasta documentação. 

Para relatórios de teste foi usado o Coverage.

Para o teste de estresse foi utilizado o Locust.

API de consulta e conversão de valores utlizada foi a https://exchangerate.host/#/ que já continham dados das principais moedas internacionais e e crypto moedas. 

## Possíveis vulnerabilidades

- É possível deletar uma moeda do banco sem nenhum tipo de validação de usuário;

- Banco de dados não otimizado para muitas requisições;

- API de consulta e conversão de cambio usada pode ter problemas, o que geraria falha nesta api.


## Requisitos não completos

O teste de estresse não conseguiu alcançar o volume de 1000 requisições por segundo devido a falta de hardware local e falta de otimização do banco de dados.

Ao chegar na faixa de 30 requisições por segundo o banco de dados não liberou novas conexões, mesmo que fossem consultas simples.
    