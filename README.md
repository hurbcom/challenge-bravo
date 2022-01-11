# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

## Como executar:

### Instalação

-   A instalação e execução da API passa pela criação de uma imagem Docker. Para isso, instale o Docker. (https://docs.docker.com/get-docker/)
-   Na raiz do projeto, execute: `docker-compose build --no-cache` para criar a imagem.

### Execução

-   Após seguir os passos da instação, ainda na raiz do projeto, execute o comando `docker-compose up` para rodar a aplicação. Nesse momento, o servidor já estará responendo requisições pela url retornada na linha de comando.

### Testes Automatizados - Unitários

-   Testes podem ser executados através do comando `docker run -it --entrypoint "python" duchometson/challenger-bravo:0.1 -m unittest`.

### Testes de Estresse - Locust

-   Para execução dos testes de estresse, será necessário instalar o pacote locust. A partir daí, com a api executada na imagem docker, rode na raiz do projeto: `python3 -m locust -f src/locust.py`.
-   Na saída do terminal irá aparecer uma url. Nela será possível configurar um teste de estresse passando como parâmetros o númerio de "usuários" para fazer as requisições e o endpoint desejado. Recomendação de execução: 1000 usuários, 100 usuarios inseridos/segundo, 172.18.0.2:5000/currency?name=BTC

## Documentação

### Descrição - Endpoints

A API oferece 4 endpoints que permitem o cliente efetuar, além conversões entre moedas presentes na database do servidor, inserções, consultas e remoções.

#### Conversão:
- Endpoint: http://localhost:5000/convert
- Método: GET
- Parametros: 
    - from(string)   => moeda valor origem
    - to(string)     => moeda valor destino
    - amount(float)  => quantidade de moedas
- Exemplo: `http://172.18.0.2:5000/convert?from=BTC&to=BRL&amount=1.2`

#### Consulta:
- Endpoint: http://localhost:5000/currency
- Método: GET
- Parametros: 
    - name(string)   => nome moeda a ser consultada
- Exemplo: `http://172.18.0.2:5000/currency?name=HURB`

#### Inserção:
- Endpoint: http://localhost:5000/currency
- Método: PUT
- Parametros: 
    - name(string)   => nome a ser inserida
    - values(float)  => valor moeda
- Exemplo: `http://172.18.0.2:5000/currency?name=RIOTPOINTS&value=25`
    
#### Remoção:
- Endpoint: http://localhost:5000/currency
- Método: DELETE
- Parametros: 
    - name(string)   => nome a ser inserida
- Exemplo: `http://172.18.0.2:5000/currency?name=RIOTPOINTS`

## Documentação Técnica

### Framework

Flask com Flask Restplusx foi o framework escolhido para a criação do micro serviço e dos endpoints. 

### Banco de Dados

Para persistência de dados foi utilizado o flask_sqlalchemy com uma base sqlite3. Com esses, um única tabela foi gerada, a currency, utilizando a classe Model de flask_sqlalchemy. Nela são armazenadas as moedas e suas informações. As colunas dessa entidade sâo: nome, valor, datetime da ultima atualização e um contador de acessos. Caso executado pela primeira vez. a tabela já é inicializada com os valores correntes das moedas indicadas no enunciado (USD, BRL, BTC, ETH e EUR). Também vale destacar que no arquivo de configuração, a moeda padrão é definida e a partir dela é definido a currency que armazenará os valores das moedas no database.

### Parsing de Models

O pacote flask_marshmallow ficou encarregado do parseamento das informações do banco de dados para preparar os dados para as responses.

### Testes

Unittest foi o pacote utilizado para execução e criação dos testes automatizados para gerar cobertura no código. Foram implemetandos 15 testes unitários com métodos de acesso ao banco de dados sendo mockados com unittest.mock. Não foram implementados testes de integração, porém os testes unitários contemplam requisições para avaliar a parametrização das requests enviadas aos endpoints.

### Integração e conversão de moedas(Task)

O pacote gratuito cryptocompare fornece à api a capacidade de converter os valores das moedas. Acontece que o tempo de requisição para essa api tornaria o serviço muito demorado para ser feito a cada requisição. Para isso, criei uma task de atualização de cotação atual. Essa tarefa é executada em paralelo com threading no momento que o servidor é ligado e atualiza, direto no banco de dados, as moedas principais do enunciado do desafio (USD, BRL, BTC, ETH e EUR). Essa atualização é disparada de N em N segundos definidos por parametrização a partir da configuração.

### Cache para otimização(Task)

Apesar de evitar a demora com requisições síncronas à api do cryptocompare, o desempenho da aplicação ainda estava bem abaixo do pedido no enunciado. Na tentativa de otimizar os acessos aos endpoints criei uma lógica de cache para as principais moedas. Através de uma tarefa que é executada em parelelo no início do aplicação, também com threading, são coletados periodicamente no banco de dados as N moedas mais populares e armazenadas em um cache em memória para evitar o custo de etabelecer conexões com o banco de dados a cada requisição. Essa lógica foi capaz de quase duplicar o valor de req/s do projeto.

### Teste de Estresse

Com o Locust foram realizados testes de estresse na api. Executando a api em uma máquina virtual com baixo de desempenho, obteve por volta de ~350req/s. 

### Execução de Aplicação

Preferencia indica no enunciado, por isso, foi escolhido o docker para criar imagem e executar a aplicação.

## Referências

-   https://flask.palletsprojects.com/en/2.0.x/
-   https://docs.docker.com/
-   http://docs.locust.io/en/stable/
-   https://pypi.org/project/cryptocompare/
