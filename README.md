# Projeto

Para rodar o projeto após baixar o repositório, basta **executar o comando docker-compose up** na raiz do projeto <br/>
Todo o projeto foi baseado no conceito de SOLID. <br/><br/>

Ao rodar docker-compose, ele executa um entrypoint que verifica se o banco está em pé<br/>
Se estiver, roda as migrations e seeds principais (moedas) do projeto<br/><br/>

Todo projeto foi pensado para ser (ou tentar ser) tudo automatizado<br/><br/>

_Features interessantes:_<br/>

- Verificação de sintaxe(eslint + prettier)<br/>
- Padronização de commits integrado com husky<br/>
- Testes unitários<br/>
- Teste de estresse.<br/>
- Projeto automatizado através de entrypoints <br/>
- Conceito SOLID :D <br/>

# Ferramentas Utilizadas <br/>

NodeJS (Typescript)<br/>
Mysql<br/>
Redis<br/>
Docker<br/>

# Rotas do Servidor

URL: baseURL/convert/?from=BTC&to=EUR&amount=100<br/>
Descrição: Conversão de 100 BTC para EUR<br/>
Método: GET<br/><br/>

URL: baseURL/<br/>
Descrição: Rota princiapl, informa o status do servidor<br/>
Método: GET<br/><br/>

URL: baseURL/coin<br/>
Descrição: Criação de moeda<br/>
Método: POST<br/><br/>

URL: baseURL/coin/:id<br/>
Descrição: Atualização de moeda<br/>
Método: PUT<br/><br/>

URL: baseURL/coin/:id<br/>
Descrição: Apagar moeda<br/>
Método: DELETE<br/><br/>

URL: baseURL/coin<br/>
Descrição: Mostra todas as moedas<br/>
Método: GET<br/><br/>

# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

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

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:

- JavaScript (NodeJS)
- Python
- Go
- Ruby
- C++
- PHP

## Requisitos

- Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um _pull request_.
  - Caso você tenha algum motivo para não submeter um _pull request_, crie um repositório privado no Github, faça todo desafio na branch **master** e não se esqueça de preencher o arquivo `pull-request.txt`. Tão logo termine seu desenvolvimento, adicione como colaborador o usuário `automator-hurb` no seu repositório e o deixe disponível por pelo menos 30 dias. **Não adicione o `automator-hurb` antes do término do desenvolvimento.**
  - Caso você tenha algum problema para criar o repositório privado, ao término do desafio preencha o arquivo chamado `pull-request.txt`, comprima a pasta do projeto - incluindo a pasta `.git` - e nos envie por email.
- O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
- Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
  - git clone \$seu-fork
  - cd \$seu-fork
  - comando para instalar dependências
  - comando para executar a aplicação
- A API pode ser escrita com ou sem a ajuda de _frameworks_
  - Se optar por usar um _framework_ que resulte em _boilerplate code_, assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.
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

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HurbCom/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
