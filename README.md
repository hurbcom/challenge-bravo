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

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:

-   JavaScript (NodeJS)
-   Python
-   Go
-   Ruby
-   C++
-   PHP

## Requisitos

-   Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um _pull request_.
    -   Caso você tenha algum motivo para não submeter um _pull request_, crie um repositório privado no Github e adicione como colaborador o usuário `automator-hurb` e o deixe disponível por pelo menos 30 dias. Ao terminar o desafio, envie o código para esse projeto criado, preencha o arquivo chamado `pull-request.txt` e nos envie um email avisando do término.
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

## Dúvidas

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HurbCom/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>


# Python Api

<h3>Projeto desenvolvido em Python com Flask</h3>

<h4>Conteúdo do projeto</h4>

- <b>Três endpoints:</b>

- `/` responsável por realizar a conversão entre duas moedas, com ambos os dados passados via parâmetro na URL. Exemplo: `?from=BRL&to=CAD&amount=10` 
- `/inserir` responsável por realizar o método get para inserir moedas.
- `/excluir` responsável por realizar o método delete para excluir determinadas moedas.

- Processo separado em __init__ e views.

- Utilizado API **economia.awesomeapi** para realizar as verificação de moedas válidas, e para obter a taxa de câmbio de cada moeda.

- Adicionado tratamento para não permitir inserção de moedas duplicadas.

- Porta teste utilizada: `5000`.


- <b>Framework utilizado:</b> Flask, Restful.
- <b>Ferramentas utilizadas:</b> Pycharm e Postman.

<hr>

<h4>Testes da API realizados utilizando Postman:</h4>

<h5>Método GET:</h5>

- Listagem de moedas: 
###### https://localhost:5000/consultar
- Conversão de BRL para USD, quantidade 10: 
###### https://localhost:5000/?from=BRL&to=USD&amount=10
>"USD", "BRL" e 10 passados por parâmetro.

<h5>Métodos POST e DELETE:</h5>

- Para cadastro: 
###### https://localhost:5000/inserir/moeda=brl
> BRL passado por parâmetro.

- Para exclusão: 
###### https://localhost:5000/excluir/moeda=brl
> BRL passado por parâmetro.

<hr>
<h4>Utilização da API:</h4>

- git clone `https://github.com/gsilvagusto/challenge-bravo.git`
- $ $ pip install -r requirements.txt
- $ python app.py ou app.py

<hr>

<h4>Observação:</h4>

- Docker ``

<hr>
Desenvolvido por: George Augusto da Silva - 09/2019