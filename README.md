# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo


## Pré-requisitos

Para conseguir rodar a aplicação na sua máquina você ter instalado na sua máquina os seguintos softwares:
- Docker - Para rodar a aplicação em conteineres (https://www.docker.com/)
- K6 - Para executar o teste de estresse (https://k6.io/)

## Arquitetura

Foi projetada uma arquitetura para essa API para que pudesse ser executada independente do sistema operacional e de forma que não necessitasse de muitas configurações. Para isso, utilizamos o docker para gerar conteineres de acordo com as imagens necessárias para a execução da aplicação. A aplicação conta com um conteiner de banco de dados (SQL Server), um com o cache de dados distribuído (Redis), dois conteineres com a aplicação e um conteiner com o load balance (Nginx).

<p align="center">
  <img src="arquitetura.jpg" alt="arquitetura" />
</p>

## Instruções para executar a aplicação














