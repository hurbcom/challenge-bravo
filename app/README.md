# Challenge Bravo
Uma REST API para conversão de moedas.

## Setup
### Pré-requisitos

- Docker
- Docker Compose

### Executar a API
A partir do diretório `./app` execute o comando:

`docker-compose build && docker-compose up`

### Testes
`npm run test`

## Endpoints

Por default as moedas disponíveis para conversão são:
- USD
- BRL
- EUR
- BTC
- ETH

Para outras moedas é preciso primeiro adicioná-las utilizando a rota `POST /api/currency`.

#### Conversão

- `GET /api/conversion?from={keyFrom}&to={keyTo}&amount={value}`
    
    Faz um request para API externa para pegar a cotação atual.
    Sempre retorna a conversão para `USD` pois é a moeda de referência.
    
    Exemplo:
    `GET /api/conversion?from=BRL&to=BTC&amount=1`
    Retorna um objeto no seguinte formato:
    ```
    {
      "BRL": "1",
      "BTC": 0.000010921582997434958,
      "USD": 0.18321729571271528
    }
    ```
    
#### Gerenciar moedas disponíveis
- `GET /api/currency`

    Retorna a lista de moedas disponíveis.
    
- `POST /api/currency`
    
    Insere uma moeda na lista de moedas disponíveis.
    
    - Exemplo do corpo da requisição em formato JSON:
    ```
    {
        "currency": "EUR"
    }
    ```

- `DELETE /api/currency`

    Remove uma moeda na lista de moedas disponíveis.
    
    - Exemplo do corpo da requisição em formato JSON:
    ```
    {
        "currency": "EUR"
    }
    ```
    
## Decisões de arquitetura

### Organização dos diretórios

O projeto está separado em camadas: 

- `api` possui as rotas e middlewares para lidar com validações e erros.
- `Controllers` para lidar com as requisições e respostas da API.
- `Services` para lidar com a lógica da aplicação.
- `DAO` para falar com o MongoDB. (Chamei de DAO apesar de não estar de fato utilizando uma DAO genérica)

### Caching

Estou utilizando o Redis para fazer caching. 
Existe cache em dois momentos: 

O primeiro para a rota `GET /api/conversion` que guarda a resposta por 10 segundos.

O segundo para guardar as respostas da API externa.
Decidi também guardar as respostas da API externa para evitar chamá-la muitas vezes sem necessidade e evitar atingir o limite de chamadas dela.

Infelizmente ainda não acaba com o problema completamente, pois ainda vai chamar a API se ocorrerem várias chamadas simultâneas que ainda não estão cacheadas.
Para resolver poderia ter utilizado uma fila com *pub/sub*, colocando na fila todas as chamadas que querem a mesma conversão e fazendo apenas uma chamada para a API externa, 
dessa forma quando essa chamada resolver dispararia um evento com a conversão para as chamadas que estão na fila utilizarem.

### Melhorias

- Utilizar swagger para documentar a api.
- Utilizar alguma lib de log como o *winston*.
- Aumentar a cobertura de testes.
- Sistema de fila com *pub/sub* descrito na sessão de [caching](https://github.com/gustavares/challenge-bravo/tree/master/app#Caching)
