# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Esta aplicação foi construída em Node.JS e a sua função é fazer conversões monetárias com retorno JSON.


Escolhi o Node.JS  para colocar em prática novos conhecimentos.

Meus objetivos foram:

- implementar o back-end da aplicação
- implementar testes de unidade no node (jest)
- implementar uma  solução para o problema de 1000 request por segundo

As informações sobre valores monetários são carregadas ao iniciar a aplicação e alocadas em memória cache,
também existe um processo de atualização das cotações ativas que é executado ao longo do dia, mantendo-os atualizados.

No acesso a parte administrativa é possível: cadastrar, excluir, atualizar uma cotacão da moeda e visualizar as ativas.

## Lista de moedas a serem convertidas:
    - USD
    - BRL
    - EUR
    - BTC
    - ETH

## Executar a aplicação
Para executar a aplicação pela linha de comando:
- **sem docker**
  - clone o repositório: `git clone https://github.com/ttiede/challenge-bravo.git`
  - acesse a pasta `cd challenge-bravo`
  - instale as dependências `npm install`
  - levante a aplicação `npm start`

- **com docker**
  - clone o repositório: `git clone https://github.com/ttiede/challenge-bravo.git`
  - acesse a pasta `cd challenge-bravo`
  - ajuste o valor da propriedade `WORKDIR`no arquivo `Dockerfile` para a pasta atual
  - builde o docker `docker build -t challenge-bravo .`
  - rode o docker `docker run -p 3000:3000 -d challenge-bravo:latest`

## Executar os testes
Para executar os testes pela linha de comando:

- certifique-se que a aplicação está rodando (passos acima)
- na pasta da aplicação, digite `npm test`

## Endpoint para conversão
É possível realizar uma conversão de valores por dois Endpoints:

Por parâmentros:
 - `/convert?from=:ORIGEM&to=:DESTINO&amount=:QUANTIDADE`

Por URL amigável (Friendly URLs)
 - `/convert/:ORIGEM/:DESTINO/:QUANTIDADE`

- **Exemplos**:

`http://localhost:3000/convert/:ORIGEM/:DESTINO/:QUANTIDADE`

`http://localhost:3000/convert?from=USD&to=BRL&amount=2`

    `curl -X GET \
      http://localhost:3000/convert/BRL/BTC/2 \
      -H 'Accept: */*' \
      -H 'Accept-Encoding: gzip, deflate' \
      -H 'Cache-Control: no-cache' \
      -H 'Connection: keep-alive' \
      -H 'Host: localhost:3000' \
      -H 'Postman-Token: fbe8b53e-ed86-4eb6-8efb-9ac51fd7c690,6ce8aee8-5b55-4048-8a5c-cd01556afb84' \
      -H 'User-Agent: PostmanRuntime/7.20.1' \
      -H 'cache-control: no-cache'`

Como resultado dessa execução:

    {
        "original": {
            "currency": "BRL",
            "amount": "2"
        },
        "result": {
            "currency": "BTC",
            "amount": "0.000056"
        }
    }

## Endpoint para administração

Optei por utilizar somente url amigáveis na parte administrativa.Não foi implementada nenhuma veriicação de segurança.

Está disponível no endereço: `/admin/convert`

Recursos do Administrativo:
   - Listar todas as moedas ativas. `GET`
   - Cadastrar a moeda. `POST`
   - Atualizar. `PUT`
   - Excluir. `DELETE`

Os processos de manipulação de uma moeda, só possível funcionar para as seguintes moedas:

    USD
    BRL
    EUR
    ETH
    BTC


Exemplos:

 - `PUT`
    http://localhost:3000/admin/convert

        {
            "currency": "USD"
        }

- `POST`
    http://localhost:3000/admin/convert

        {
            "currency": "USD"
        }

- `DELETE`
http://localhost:3000/admin/convert/USD

- `GET` http://localhost:3000/admin/convert


## Melhorias

 - Implementar uma segurança na parte administrativa.
 - Implementar  o  Swagger.

## Dúvidas
Estou disponível para qualquer dúvida ou sugestão.

Tiago Tiede -
geschopf@gmail.com

