# Bravo

O objetivo deste projeto é o desenvolvimento do desafio de programação do Hotelurbano.

Para facilitar a utilização fiz o deploy na AWS utilizando o Elasticbeanstalk com Docker, ficando disponível em: bravo.us-east-1.elasticbeanstalk.com

    # Exemplo

    GET bravo.us-east-1.elasticbeanstalk.com/quotations?from=BRL&to=ETH,BTC,EUR,USD,BRL,UNKNOWN&amount=15.0

    {
      "USD": 4.70219436,
      "UNKNOWN": "currency is not supported",
      "EUR": 3.79231975,
      "ETH": 0.00398182,
      "BTC": 4.1036e-4,
      "BRL": 15.0
    }


# Teste de Stress da aplicação

O teste de stress foi executado em uma instância com 2 cores.

O resultado pode ser consultado em: http://bit.ly/2GqEJKv.

![Print do Resultado](https://screenshots.firefox.com/sckDjuC3T4uhmg51/loader.io)

## Documentação da utilização da api

A aplicação apenas suporta formato de response em json

**Modeas Suportadas**

    USD: Dolar US
    BRL: Real
    EUR: Euro
    BTC: Bitcoin
    ETH: Etherium

**Solicitação de cotação de apenas uma moeda**

    GET /quotations?from=BRL&to=ETH&amount=15.0

    STATUS 200

    {
      "ETH":0.00398538
    }

**Solicitação de cotação para multiplas modedas**

    GET /quotations?from=BRL&to=ETH,BTC,EUR,USD,BRL,UNKNOWN&amount=15.0

    STATUS 200

    {
      "USD": 4.70219436,
      "UNKNOWN": "currency is not supported",
      "EUR": 3.79231975,
      "ETH": 0.00398182,
      "BTC": 4.1036e-4,
      "BRL": 15.0
    }

**Errors**

    GET /quotations

    STATUS 422

    {
      "errors": [
        "param \"from\" is required",
        "param \"to\" is required",
        "param \"amount\" is required"
      ]
    }

## Escolhas técnicas

### Porque Elixir?

Primeiramente escolhi utilizar Elixir por um requisito do desafio (A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse), como não havia especificação do tamanho da infra que poderia utilizar, **escolhi o elixir pois é a linguagem mais rápida que tenho intimidade**.

### Banco de Dados e Cache

Nesta aplicação escolhi não utilizar nem um serviço de banco de dados. Por dois motivos:

1. Não era explicitamente exigido que fosse utilizado qualquer tipo de banco de dados.
2. O recurso necessário era um cache simples, poderia ter utilizado redis ou qualquer outro serviço de cache. Porém, escolhi desenvolver um "in-memory" cache (Bravo.Cache) key-value. Isso proporcionou duas vantagens: (1) Foi eliminado um ponto de falha e (2) redução dos recursos extras e tempo que serão reservados para essa tarefa.

### Atualização do Cache

Para evitar o acesso a API de cotações sem necessidade e por utilizar um serviço "gratuito" com limite de requests, foi implementado um "worker" (Bravo.QuotationUpdater) que atualiza a cotação a cada 5 segundos após à última atualização.

Estas escolhes tornam cada instância da aplicação totalmente independente.

### Segurança

Aqui deveria exitir uma autenticação (seja basic auth, token, etc), basicamente para que se fosse possível gerênciar a quantidade de requests permitidas por usuário. Pórem, como não era um requisito do desafio não foi implementado.

### Adicionais

No endpoint padrão, adicionei a possibilidade de enviar mais de uma moeda para ser calculada ao mesmo tempo. Isso foi feito apenas adicionando a possibilidade de separar as moedas do parâmetro "to" com vírgula. Mantendo ainda a compatibilidade com a documentação.

## Execução utilizando o docker localmente

Para inicializar à aplicação utilizando o docker basta buildar a imagem e executar a aplicação. Esse processo irá inializar a aplicação em uma porta randomica.

  $ docker build -t bravo-allanbatista . && docker run -d -P bravo-allanbatista

## Deploy para produção

O deploy foi configurado utilizando o Elasticbeanstalk. Para mais informações veja [eb-cli3](https://docs.aws.amazon.com/pt_br/elasticbeanstalk/latest/dg/eb-cli3.html).

### Instalação

    # Adicionar variável de ambiente
    echo 'export PATH=~/.local/bin:$PATH' >> ~/.bashrc && source ~/.bashrc

    # https://docs.aws.amazon.com/pt_br/elasticbeanstalk/latest/dg/eb-cli3-install-linux.html
    $ pip install awsebcli --upgrade --user

    # Testar instalação completa
    $ eb --version
    EB CLI 3.12.1 (Python 2.7.1)

### Criação do ambiente

    $ eb create -c bravo -r us-east-1 -i c5.large --elb-type application bravo

## Docker

Foi utilizado o docker para construir o ambiente de deployment da aplicação.

### Docker Image Base

A imagem base foi construida separadamente para poder ser re-utilizada entre diversos projetos e utilizaremos a versao 0.6 pois é a versão mais lite e  possui todos os recursos necessários para ser utilizado no projeto.

[source](https://bitbucket.org/allanbatista/docker-images/src/5ec696deec12ec1c033b227fb08a098f1fb9bde4/phoenix/0.6/Dockerfile?at=master&fileviewer=file-view-default)

[dockerhub](https://hub.docker.com/r/allanbatista/phoenix/)
