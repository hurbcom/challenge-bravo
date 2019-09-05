# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Este repositório contém uma prova de conceito de uma API para conversão monetária. A API é implementada em Node.js através do framework Express, com alguns outros detalhes de infraestrutura.

## Endpoints

- `/api`: retorna, em JSON, a conversão de um valor em determinada moeda para outra. O único método deste *endpoint* é GET. É preciso passar os seguintes parâmetros:
  - `from`: código da moeda de origem;
  - `to`: código da moeda de destino;
  - `amount`: valor a ser convertido.
- `/currencies`: Utilizado para inserir e remover moedas do serviço de conversão. Métodos disponíveis:
  - GET: retorna todas as moedas suportadas;
  - PUT: insere uma nova moeda através do parâmetro `currency`;
  - DELETE: remove a moeda passada pelo parâmetro `currency`.

## Execução

O serviço pode ser executado de diversas maneiras: localmente, através de *containers* Docker e através do orquestrador Kubernetes (sobre *containers* Docker). Este repositório possui *scripts* para as duas últimas opções.

### Docker

Supondo que a ferramenta Docker já está instalada em sua máquina, basta executar `docker-compose up`. 

Há três *containers*: um que propriamente executa o servidor em Node.js, outro que executa o *data store* Redis e outro que executa servidor NGINX como *proxy* reverso.

Com a finalidade de deixar o serviço mais escalável, é possível executá-lo dentro de um *stack* Docker (e posteriormente entre outras máquinas):

1. Inicialize o *swarm* com `docker swarm init --advertise-addr=<endereco>`;
2. Faça o *deploy* do *stack* com `docker stack deploy --compose-file docker-compose.yml web`;

#### Kubernetes

Supondo que o Kubernetes já está instalado em sua máquina (e.g. Minikube), basta executar:
1. `sudo mkdir -p /k8s/nginx && sudo cp ../nginx.conf /k8s/nginx/nginx.conf`;
2. `cd k8s && sudo kubectl create -f .`

Por conveniência, este repositório também fornece um arquivo para criar automaticamente uma máquina virtual com Vagrant de forma a instalar todos os pré-requisitos para executar o serviço em Kubernetes. Caso deseje utilizar este arquivo, basta instalar o Vagrant e executar `vagrant up`. Os *endpoints* ficarão acessíveis no endereço `192.168.50.2`.

## Detalhes de funcionamento

O serviço tem um modo de funcionamento muito simples. O NGINX mapeia solicitações para o servidor Node.js, que recebe solicitações de conversão e verifica se a taxa de conversão está disponível em um cache fornecido pelo Redis. Se a taxa está no cache, ela é recuperada e a operação de conversão é realizada. Caso contrário, a taxa e sua inversa são recuperadas de forma assíncrona de uma API externa e inseridas no cache, com tempo de expiração de uma hora.

Este é um exercício interessante de integração de tecnologias. Embora a prova de conceito desenvolvida obviamente não esteja pronta para produção, ela utiliza alguns elementos que são práticas comuns no mercado.