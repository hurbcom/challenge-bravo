# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

A API deve suportar conversão entre moedas verídicas e fictícias. Exemplo: BRL->HURB, HURB->ETH

"Moeda é o meio pelo qual são efetuadas as transações monetárias." (Wikipedia, 2021).

Sendo assim, é possível imaginar que novas moedas passem a existir ou deixem de existir, é possível também imaginar moedas fictícias como as de D&D sendo utilizadas nestas transações, como por exemplo quanto vale uma Peça de Ouro (D&D) em Real ou quanto vale a GTA$ 1 em Real.

Vamos considerar a cotação da PSN onde GTA$ 1.250.000,00 custam R$ 83,50 claramente temos uma relação entre as moedas, logo é possível criar uma cotação. (Playstation Store, 2021).

Ref:
Wikipedia [Site Institucional]. Disponível em: <https://pt.wikipedia.org/wiki/Moeda>. Acesso em: 28 abril 2021.
Playstation Store [Loja Virtual]. Disponível em: <https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D>. Acesso em: 28 abril 2021.

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:

-   JavaScript (NodeJS)
-   Python
-   Go
-   Ruby
-   C++
-   PHP

## Requisitos

-   Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um _pull request_.
    -   Caso você tenha algum motivo para não submeter um _pull request_, crie um repositório privado no Github, faça todo desafio na branch **master** e não se esqueça de preencher o arquivo `pull-request.txt`. Tão logo termine seu desenvolvimento, adicione como colaborador o usuário `automator-hurb` no seu repositório e o deixe disponível por pelo menos 30 dias. **Não adicione o `automator-hurb` antes do término do desenvolvimento.**
    -   Caso você tenha algum problema para criar o repositório privado, ao término do desafio preencha o arquivo chamado `pull-request.txt`, comprima a pasta do projeto - incluindo a pasta `.git` - e nos envie por email.
-   O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
-   Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
    -   git clone \$seu-fork
    -   cd \$seu-fork
    -   comando para instalar dependências
    -   comando para executar a aplicação
-   A API pode ser escrita com ou sem a ajuda de _frameworks_
    -   Se optar por usar um _framework_ que resulte em _boilerplate code_, assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.
-   A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.

## Critério de avaliação

-   **Organização do código**: Separação de módulos, view e model, back-end e front-end
-   **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?
-   **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?
-   **Legibilidade do código** (incluindo comentários)
-   **Segurança**: Existe alguma vulnerabilidade clara?
-   **Cobertura de testes** (Não esperamos cobertura completa)
-   **Histórico de commits** (estrutura e qualidade)
-   **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?
-   **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?

 ---
 ### Tecnologias Utilizadas

 As tecnologias escolhidas para o desenvolvimento do projeto foram:
 - Python
 - Flask
 - Mongodb
 - Docker

### Para executar a aplicação basta executar um comando:
 ``` App
 $ sh start.sh
 ```
 ``` Testes
 $ sh test.sh
 ```
A aplicacão estará rodando na porta 5000 do localhost.

 ### Documentação da API
 Os endpoints da API são:
### Get
http://localhost:5000/currencies
### Post
http://localhost:5000/currencies
 ```
Body = {
    'code': ,
    'currency_name':
    'currency_value_in_usd':
   }
```
PUT:
 - http://localhost:5000/currencies/{code}
```
Body = {
    'currency_value_in_usd':
   }
```
DELETE:
- http://localhost:5000/currencies
```
Body = {
    'code': 'HURB',
  }
 ```
Obs: o corpo da requisição delete é uma query e caso haja um "Match", multiplos elementos podem ser removidos

A moeda adicionada a partir do endpoint terá prioridade independentemente se a moeda
é verídica ou não. Ou seja caso uma moeda verídica seja adicionada a cotação utilizada será aquela
determinada pelo usuário. Caso ela não tenha sido criada a cotação dela será a atual.

### Convert
http://localhost:5000/convert?from=BRL&to=HURB&amount=12

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
