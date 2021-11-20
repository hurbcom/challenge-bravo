# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

# Introdução: 

Foi criada uma API para realizar conversões monetárias. Neste desafio utilizei a api publica https://docs.awesomeapi.com.br/ para converter moedas que já existem. Para moedas fictícias, a api armazena cotações no banco de dados.

# Tecnologias:
    - NodeJS
    - Typescript
    - MySQL
    - Redis
    - Docker

# Execução da API:
    Instalar as dependências do projeto:
    
     - npm install
    
    Executar aplicação através do docker-compose
    
    - docker-compose up
    

# Rotas
```
{url}/cotations/                             |    POST  | Adiciona uma nova cotação
{url}/cotations/                             |  DELETE  | Remove uma cotação.
{url}/cotations/?to=USD&from=EUR&amount=1000 |    GET   | Retorna a cotação da moeda e o valor
```

# Observações
A api não possui autenticação, sendo assim, qualquer um pode criar ou converter.

A solução ideal na minha opinião seria, ao invés de cadastrar uma cotação, cadastrar uma moeda e armazenar o valor dela baseada numa moeda existe, como dólar por exemplo. Assim, poderia ser feito qualquer conversão para qualquer moeda, desde que fosse realizada a conversão primeiro para dólar.

