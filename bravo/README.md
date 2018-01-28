# Bravo

O objetivo deste projeto é o desenvolvimento do desafio de programação do Hotelurbano.

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

    $ eb create -c bravo -r sa-east-1 -i t1.micro --elb-type application bravo

## Docker

Foi utilizado o docker para construir o ambiente de deployment da aplicação.

### Docker Image Base

A imagem base foi construida separadamente para poder ser re-utilizada entre diversos projetos e utilizaremos a versao 0.2 pois é a versão mais lite e já possui todos os recursos necessários para ser utilizado no projeto.

[source](https://bitbucket.org/allanbatista/docker-images/src/5ec696deec12ec1c033b227fb08a098f1fb9bde4/phoenix/0.2/Dockerfile?at=master&fileviewer=file-view-default)

[dockerhub](https://hub.docker.com/r/allanbatista/phoenix/)
