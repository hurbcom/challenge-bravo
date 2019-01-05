# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve converter entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:
- JavaScript (NodeJS)
- Python
- Go
- Ruby
- C++
- PHP

Você pode usar qualquer _framework_. Se a sua escolha for por um _framework_ que resulte em _boilerplate code_, por favor assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.

## Requisitos
- Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um *pull request*.
- O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
- Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
  - git clone $seu-fork
  - cd $seu-fork
  - comando para instalar dependências
  - comando para executar a aplicação
- A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.



## Critério de avaliação

- **Organização do código**: Separação de módulos, view e model, back-end e front-end
- **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?
- **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?
- **Legibilidade do código** (incluindo comentários)
- **Segurança**: Existe alguma vulnerabilidade clara?
- **Cobertura de testes** (Não esperamos cobertura completa)
- **Histórico de commits** (estrutura e qualidade)
- **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?
- **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?

## Dúvidas

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HotelUrbano/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>

## Documentação

### Endpoints

**base:** `http:localhost:8000

| Verbo | URI | Descrição |
|-------|-----|-----------|
| GET | `/api/convert` | Converte valor de uma moeda para outra |

**Parametros:**

- from: moeda de origem *(obrigatório)*
- to: moeda de destino *(obrigatório)*
- amount: montante a ser convertido *(obrigatório)*

**Exemplo:**

```
// Converte 100 dólares em reais.
http://localhols:8000/api/convert?from=USD&to=BRL&amount=100
```

**Resposta:**

```
{
  "From":"USD",
  "To":"BRL",
  "Amount":100,
  "Quote":3.715204, // representa a cotação USD-BRL
  "Result":371.5204 // representa o valor convertido
}
```

### Setup

Para instalar biblieoteca `gorilla/mux`
```
$ go get -u github.com/gorilla/mux
```

Para gerar o executável
```
$ go build api.go
```

Para rodar o software
```
$ ./api
```

Para testar o pacote `exchange`
```
$ go test exchange/* -v
```


### (in)Segurança

- As chaves de acesso às APIs externas estão no código
- Não há certificado para habilitar o TLS 
- Não há medidas de proteção contra DDoS

### Falhas

- Não há negociação do tipo de conteúdo, só retorno JSON
- A aplicação não está instrumentalizada, os logs que eventualmente ainda estão no código foram para debugar
- API não versionada
- Não há qualquer otimização
   - Minto, apenas o curto circuito que realizo quando moeda de origem e destino são iguais
- Não sei se a aplicação consegue de fato receber 1000 requisições por segundo. Mas sei que existe a ferramenta Vegeta para realizar esse teste
- Sem Docker

### Contexto, Processo e Arquitetura

- Escolhi Golang para o desafio porque era uma das linguagens listadas como domínio da equipe, dessa forma espero receber um feedback de maior qualidade; além disso, eu gostaria mesmo de colocar em prática meu conhecimento dessa linguagem, que é básico, mas a vontade é grande
- Tentei fazer todo o sistema com base em TDD `red` `green` `refactor`
- Apliquei boas práticas na escrita do commit, mas definitivamente não fui natural; primeiro porque deliberadamente queria realizar um commit por tipo de teste implementado; depois porque meu fluxo normal de trabalho é commitanto micro alterações
- Tentei aplicar o máximo possível de DDD e isso gerou uma complexidade desnecessária e me tomou um tempo que já é escasso, mas valeu a pena porque deixou o sistema com fronteiras bem definidas
- Demorei bastante pra fazer o desafio, mas não foi por falta de planejamento; meu trabalho atual exije bastante do meu tempo, não é raro sair tarde; pra completar o chefe saiu de férias e eu fiquei no comando; fora as atividades de fim de ano e etc.
- Adoraria receber feedback, nem que seja pra dizer "Tá ó! Uma bosta!". Abraço!