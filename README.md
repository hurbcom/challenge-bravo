# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Endpoints
- `/convert`: sendo o único método disponível o GET, performa a principal atividade da API de conversão de moedas sobre
  os parâmetros passados para este *endpoint* e responde com texto JSON. Tais
  parâmetros são:
      - `from`: sigla da moeda de origem
      - `to`: sigla da moeda de destino
      - `amount`: unidades da meoda de origem a serem convertidas

  Ex: `?from=BTC&to=EUR&amount=123.45`

- `/coin/{id}`: neste *endpoint* os métodos POST e DELETE são
  disponibilizados para, respectivamente, adicionar e remover moedas suportadas
  pela API. Em ambos métodos, o parâmetro `id` é utilizado, representando a
  sigla da moeda a ser inserida ou removida.

  Ex: POST `/coin/CAD`, DELETE `/coin/CAD`

## Execução
Este serviço poder ser executado localmente, utilizando Redis com seu endereço
padrão e executando o comando `node index.js` na pasta raiz da API, ou através do docker com o comando
`docker-compose up` para fins de
simplicidade.

<p align="center">
  <img src="ca.jpg" alt="Challenge completed" />
</p>
