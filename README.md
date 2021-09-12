# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo


## Pré-requisitos

Para conseguir rodar a aplicação na sua máquina você ter instalado na sua máquina os seguintos softwares:
- Docker - Para rodar a aplicação em conteineres (https://www.docker.com/)
- K6 - Para executar o teste de estresse (https://k6.io/)

## Arquitetura

### Tecnologias utilizadas:
- **C# (.Net Core 5)** - Escolhi essa linguagem por possuir maior domínio e por ser uma linguagem muito robusta e performática, possui também uma boa documentação, atualizações recorrentes e uma grande comunidade. 
- **SQL Server** - Esse banco foi escolhido por ser uma opção simples pro que é necessário e por eu possuir maior experiência com o mesmo.
- **Redis** - Foi escolhido para fazer cache dos dados e distribuí-los entre as instências da aplicação permitindo maior escalabilidade da API.
- **Nginx** - Foi usado para criar um load balance, pois sua configuração básica é simples. Ele nos permite diminuir a carga de requisições na aplicação dividindo entre as instâncias, conseguindo manter a API em funcionamento no caso de uma das intâncias ficar fora do ar. 
- **Docker** - Foi Escolhido para permitir que a aplicação seja executada de forma isolada, evitando ter que ficar instalando e configurando cada tecnologia.

Foi projetada uma arquitetura para essa API para que pudesse ser executada independente do sistema operacional e de forma que não necessitasse de muitas configurações. Para isso, utilizamos o docker para gerar conteineres de acordo com as imagens necessárias para a execução da aplicação. A aplicação conta com um conteiner de banco de dados (SQL Server), um com o cache de dados distribuído (Redis), dois conteineres com a aplicação e um conteiner com o load balance (Nginx).

<p align="center">
  <img src="arquitetura.jpeg" alt="arquitetura" />
</p>

Foi utilizado o cache com Redis para poder ganhar performance nas repostas das requisições e para poder compartilhar as informações entre as possíveis instâncias da aplicação que podemos executar. O Redis é um banco de dados NoSql de chave/valor. Ele roda em memória, por conta disso o acesso de escrita e leitura dele é muito mais rápido do que escrever no disco como o banco de dados relacional SQL Server que usamos para manter os dados das moedas guardados.

A aplicação possui um load balance com Nginx que serve como um proxy que recebe as requisições dos diversos usuários e vai repassando para as instâncias da aplicação de acordo com a quantidade de conexões que cada um tem no momento dividindo a carga entre eles.

Para manter as moedas existentes atualizadas a API possui um serviço hospedado (HostedService) que é executado a cada 1 hora, podendo ser alterado para o tempo que seja necessário. Esse serviço consume a API Open Exchange Rates (https://openexchangerates.org/) para conseguir o valor das contações das moedas reais. Ela foi escolhida por possuir uma grande variedade de moedas incluindo as criptomoedas, no plano gratuito consegue fazer 1000 requisições no mês e ela utiliza como base o dolar.

## Instruções para executar a aplicação

Para executar a aplicação é necessário que abra o cmd e entre na pasta raíz da solução CurrencyQuontation e dentro dela deve-se executar o comando `docker-compose up -d`. Esse comando irá criar os conteineres de acordo com as imagens configuradas, se não existir na máquina elas serão baixadas na hora. Após fazer isso podemos ter uma visualização dos endpoints que a Currency API fornece pelo link http://localhost:5000/swagger/index.html. Isso é possível porque foi instalada uma biblioteca chamada Swagger que nos fornece uma documentação da nossa API, facilitando para quem for consumi-la quais endpoints nós temos e como devemos usa-los. É possível até mesmo realizar testes por essa UI.

<p align="center">
  <img src="swagger.png" alt="swagger" />
</p>

Caso queria, também adicionei o json `currency_api.postman_collection.json` que pode ser importado no Postman (https://www.postman.com/) com todas as requisições prontas para serem usadas. 


## Testes

### Testes Unitários

Para realizar os testes unitários eu utilizei a bibliotece xUnit que já vem no C#.

<p align="center">
  <img src="testesUnitarios.png" alt="Testes Unitários" />
</p>

### Teste de estresse

Para realizar o teste de estresse utilizei a ferramenta chamada K6 pela facilicadade de configuração e execução. Montei um teste que testa a API mandando requisições de conversão para ela. Configurei o script de teste para criar 3000 VUs (Máquinas) para ficarem mandando requisições para a API durante 30s e ele me retorna as estatíticas de resultado.

<p align="center">
  <img src="testesUnitarios.png" alt="Testes Unitários" />
</p>











