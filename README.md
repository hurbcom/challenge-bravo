# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

**Recrutadora**: Paloma Andrade

**Cadidato**: Iury Dias

##Requisitos

* [Docker-compose](https://docs.docker.com/compose/install/)

##Arquitetura do projeto

![alt text](https://github.com/iiurydias/challenge-bravo/blob/master/architecture.png?raw=true "Arquitetura do projeto")

**api**: Responsável por receber requisições para adição, remoção e converção de moedas. Chamadas de adição e remoção são encaminhadas para o serviço atualizador de cotações através de serviços gRPC, além de realizar conversões através de valores resgatados em cache.

**currency-rate-updater**: Microsserviço responsável por servir funções de adicionar e remover moedas suportadas através de gRPC e guardar/atualizar cotações das moedas suportadas em cache.

**redis**: Serviço de cache responsável por manter valores de cotação das moedas suportadas.

##Iniciando a aplicação
Após clonar o projeto em sua máquina e com os requisitos já instalados, executar o seguinte comando:
```shell script
    docker-compose up
```
Isso subirá o serviço de **API** na porta ```3500```.

*Obs: Configurações de host, porta, acesso ao cache de cada serviço são configuráveis através dos arquivos **config.json** dentro dos respectivos repositórios dentro do projeto. Moedas iniciais suportadas da aplicação também são configuradas da mesma forma, as requisitadas pelo desafio já se encontram no arquivo.*

##Rotas

###Converção de moedas

```GET /currency```

**Requisição**

Parâmetros (*Via Query*)

* **From**: Código da moeda inicial
     
* **To**: Código da moeda a ser convertida
    
* **Amount**: Quantidade a ser convertida

Exemplo:

```curl -XGET 'localhost:3500/currency?from=USD&to=BRL&amount=1'```

####Respostas

+ **Success** 201

```json
{
  "status": "success",
  "data": {
    "code": "CAD"
  }
}  
``` 
+ **Fail** 400

```json
{
  "status": "fail",
  "data": {
    "code": "code has a invalid type"
  }
}    
``` 

###Adicionar nova moeda suportada

```POST /currency```

**Requisição**

Parâmetros (*application/json*)

* **Code**: Código da moeda 

```curl -XPOST -H "Content-type: application/json" -d '{"code":"CAD"}' 'localhost:3500/currency'```

####Resposta

+ **Success** 201

```json
{
  "status": "success",
  "data": {
    "code": "CAD"
  }
}  
``` 
+ **Fail** 400

```json
{
  "status": "fail",
  "data": {
    "code": "code has a invalid type"
  }
}    
```  

###Remover moeda suportada

```DELETE /currency/:code```

**Requisição**

Parâmetros (**Via URI**)

* **Code**: Código da moeda

```curl -XDELETE 'localhost:3500/currency/CAD''```

####Resposta

+ **Success** 204

+ **Fail** 404

```json
{
  "status": "fail",
  "data": {
    "code": "code not found"
  }
}   
```  

*Obs: Códigos das moedas seguem o padrão da [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217).*

###Executando testes

**Requisitos**

* [Golang](https://golang.org/doc/install) 1.15

####Comando

É necessário entrar no respositório de cada serviço e executar o comando:

```make run-tests```

####Saída

**api**

```
ok      github.com/iiurydias/challenge-bravo/api/application                    1.613s  coverage: 58.8% of statements
ok      github.com/iiurydias/challenge-bravo/api/application/client             0.070s  coverage: 92.9% of statements
?       github.com/iiurydias/challenge-bravo/api/application/client/currency    [no test files]
ok      github.com/iiurydias/challenge-bravo/api/application/controller         0.039s  coverage: 100.0% of statements
ok      github.com/iiurydias/challenge-bravo/api/application/handlers           0.089s  coverage: 94.4% of statements
```

**currency-rate-updater**

```
?       github.com/iiurydias/challenge-bravo/currency-rate-updater                              [no test files]
ok      github.com/iiurydias/challenge-bravo/currency-rate-updater/cache                        0.049s  coverage: 100.0% of statements
ok      github.com/iiurydias/challenge-bravo/currency-rate-updater/service                      3.395s  coverage: 51.2% of statements
ok      github.com/iiurydias/challenge-bravo/currency-rate-updater/service/controller           0.040s  coverage: 100.0% of statements
ok      github.com/iiurydias/challenge-bravo/currency-rate-updater/service/currency             0.072s  coverage: 95.7% of statements
?       github.com/iiurydias/challenge-bravo/currency-rate-updater/service/errors               [no test files]
ok      github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server               0.047s  coverage: 86.7% of statements
?       github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server/currency      [no test files]
```

###Benchmark

Testes de benchmark foram realizados com a ajuda do [wrk](https://github.com/wg/wrk), uma ferramenta para medição de performance de serviços web, onde foi obtido o seguinte resultado:

![alt text](https://github.com/iiurydias/challenge-bravo/blob/master/benchmark.png?raw=true "Arquitetura do projeto")

Resultando em **11.13k de requisições por segundo**, parametrizado através de 400 conexões distribuídas em 12 threads durante 30 segundos.