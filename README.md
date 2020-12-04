# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Challenge Bravo

## Proposta

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

- USD
- BRL
- EUR
- BTC
- ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

## Solução

Esta API foi criada com o objetivo de armazenar as informações de moedas, contendo seus códigos e nomes, e também realizar a conversão entre as diferentes moedas que se encontram previamente cadastradas no banco de dados, utilizando uma API externa para isso: https://min-api.cryptocompare.com/documentation. As conversões utilizam como parâmetro os códigos de origem e destino, e também o montante que será convertido.

## Executar aplicação

Caso prefira executar a aplicação em Docker, basta executar os seguintes comandos:
- `git clone https://github.com/leomeliande/challenge-bravo` para clonar o repositório.
- `cd challenge-bravo` para entrar na pasta do projeto.
- `docker-compose up -d` para subir o container da aplicação.

Por outro lado, se quiser executar sem utilizar o Docker, basta executar os seguintes comandos: 
- `git clone https://github.com/leomeliande/challenge-bravo` para clonar o repositório.
- `cd challenge-bravo` para entrar na pasta do projeto.
- `npm install` para instalar as dependências do projeto.
- `npm start` para iniciar a aplicação em modo de produção.

Caso queira executar a aplicação em modo de desenvolvimento, use o comando:

<pre>npm run dev</pre>

### Tecnologias utilizadas

A API foi desenvolvida em NodeJS (v12.18.4) e utiliza os seguintes pacotes:

- Core
  - express
  - express-validator
  - axios
  - cors
  - dotenv
  - mongoose

- Testes
  - mocha
  - chai
  - chai-http
  - artillery

## Endpoints

A API possui quatro funcionalidades: criação de moedas, listagem, exclusão de moedas, além da conversão monetária. Os endpoints da aplicação são descritos a seguir:

Verbo        | Endpoint                                       | Função       | Rota
-------------|------------------------------------------------|--------------|------------------
GET          | /currencies/list                               | findAll      | currencyController.findAll
POST         | /currencies/new                                | create       | currencyController.create
DELETE       | /currencies/remove/id/                         | deleteByID   | currencyController.deleteByID
DELETE       | /currencies/remove/code/                       | deleteByCode | currencyController.deleteByCode
GET          | /convert                                       | convert      | converterController.convert

## Funcionalidades

### Listagem de moedas

A função findAll faz uma requisição GET à API e retorna em JSON todos as moedas cadastradas no banco de dados. Ela é executada na URL http://localhost:3301/api/v1/currencies/list.

### Cadastro de moedas

A função create faz uma requisição POST à API na URL http://localhost:3301/api/v1/currencies/new. Deve-se passar no body da requisição o código da moeda, e o nome dela. Caso seja registrado com sucesso, retorna com status <b>200</b> e as informações da moeda recém cadastrada.

Exemplo de requisição:

<pre>
{
    "sigla": "BRL",
    "nome": "Real Brasileiro"
}
</pre>

Resposta:

<pre>
{
    "_id": "5fca6bd43c8d2333cc2d7fab",
    "sigla": "BRL",
    "nome": "Real Brasileiro",
    "__v": 0
}
</pre>

### Exclusão de moeda por ID

Caso o usuário queira deletar uma moeda pelo seu ID, utiliza-se a URL http://localhost:3301/api/v1/currencies/remove/id/{currency_id} e é realizado uma requisição DELETE, usando a função deleteByID. Informa-se o ID da moeda a ser apagada e pronto, seu registro é deletado da base de dados. Caso a moeda não seja encontrada, retorna <b>404</b> com a mensagem de erro apropriada.

Exemplo de requisição:

<pre>http://localhost:3301/api/v1/currencies/remove/id/5fca6bd43c8d2333cc2d7fab</pre>

Resposta:

<pre>
{
    "message": "Moeda deletada com sucesso!"
}
</pre>

### Exclusão de moeda por código

Utilizando a função deleteByCode, a exclusão por código é bastante parecida a por ID, mas ao invés do ID da moeda, é informado o seu código, ou sigla. Primeiro é feito uma consulta na base de dados pra ver se aquela moeda existe, e caso sim, ela é excluída. Se não, retorna <b>404</b> com a mensagem de erro apropriada.

Exemplo de requisição:

<pre>http://localhost:3301/api/v1/currencies/remove/code/BRL</pre>

Resposta:

<pre>
{
    "message": "Moeda deletada com sucesso!"
}
</pre>

### Conversão monetária

A conversão monetária é o ponto chave dessa aplicação. Utilizando a função convert, é realizada uma requisição GET para a seguinte URL: http://localhost:3301/api/v1/convert?from={from}&to={to}&amount={amount}, onde:

- from = A moeda de origem
- to = A moeda de destino
- amount = O valor que deverá ser convertido entre as moedas

A partir dessas informações é consultada na API da CryptoCompare (https://min-api.cryptocompare.com/) o preço das moedas de origem e destino, utilizando o USD como referência. É realizado então o cálculo da taxa de conversão, e por fim essa taxa é aplicada à multiplicação do valor informado para conversão. O resultado é então retornado e informado pela API.

Exemplo de requisição:

<pre>http://localhost:3301/api/v1/convert?from=BRL&to=EUR&amount=123.45</pre>

Resposta:

<pre>
{
    "message": "Conversão de 123.45 em BRL para EUR",
    "BRL": 123.45,
    "EUR": 19.491
}
</pre>

## Validação

Foram implementados filtros na aplicação de validação das informações digitadas nas requisições. São as seguintes:

### Moedas:

- A moeda cadastrada devem fazer parte das moedas suportadas pela API. São elas: `'USD', 'BRL', 'EUR', 'BTC', 'ETH'`;
- A sigla da moeda deve ser digitada em maiúsculo;
- A sigla da moeda deve possuir apenas 3 caracteres.
- O nome da moeda precisa ter no mínimo 3 caracteres e no máximo 100.

### Conversão:

- As moedas de origem e destino devem ser informadas;
- As siglas das moedas de origem e destino devem ser digitadas em maiúsculo;
- O valor para conversão deve ser informado;
- O valor precisa ser maior que zero.

## Testes

Tentei realizar uma cobertura ampla de testes, contemplando os endpoints da API e seus verbos GET e POST, e também de leitura e gravação direto no banco de dados.

Para executar os testes unitários, utilize o comando abaixo:

<pre>

> mocha --exit test/test_index.js

API rodando em http://localhost:3301/
Banco de dados conectado!

  Executando testes...
    Testes dos endpoints da API:
      Currencies - /GET
        √ Retorna todas as moedas salvas no banco de dados (112ms)
      Currencies - /POST
        √ Deve criar moeda no banco de dados - USD (174ms)
        √ Deve criar moeda no banco de dados - BRL (51ms)
        √ Não deve criar moeda no banco de dados - Moeda não suportada
        √ Não deve criar moeda no banco de dados - Sigla em minúsculo
        √ Não deve criar moeda no banco de dados - Sigla inválida
        √ Não deve criar moeda no banco de dados - Nome inválido
      Converter - /GET
        √ Deve converter as moedas - USD para BRL (1196ms)
        √ Não deve converter as moedas - USD para PHP (50ms)
        √ Não deve converter as moedas - Moeda de origem em minúsculo
        √ Não deve converter as moedas - Moeda de destino em minúsculo
        √ Não deve converter as moedas - Valor igual a zero

    Testes do banco de dados:
      Testando gravação e leitura no banco de dados
        √ Nova moeda salva no banco de dados
        √ Deve retornar moeda previamente cadastrada (PHP)
        √ Deve retornar todas as informações do banco de dados

  12 passing (3s)
</pre>

Para realizar o teste de estresse (1000 requisições por segundo), utilize o comando abaixo:

<pre>npm run stress</pre>

## Contato

Dicas, dúvidas e sugestões? Sinta-se a vontade para entrar em contato comigo! :-)

Leonardo Meliande | leo.meliande25@outlook.com