<h1 align="center">Challange Bravo - HURB</h1>


## 📝 Índice

- [Description](#desc)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Development](#development)
- [Vulnerabilities](#vulnerabilities)
- [Comments](#comments)

## 🧐 Description <a name = "desc"></a>

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com **cotações de verdade e atuais**.

A API precisa converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Outras moedas podem ser adicionadas conforme o uso.

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

A API deve suportar conversão entre moedas fiduciárias, crypto e fictícias. Exemplo: BRL->HURB, HURB->ETH

"Moeda é o meio pelo qual são efetuadas as transações monetárias." (Wikipedia, 2021).

Sendo assim, é possível imaginar que novas moedas passem a existir ou deixem de existir, é possível também imaginar moedas fictícias como as de Dungeons & Dragons sendo utilizadas nestas transações, como por exemplo quanto vale uma Peça de Ouro (D&D) em Real ou quanto vale a GTA$ 1 em Real.

Vamos considerar a cotação da PSN onde GTA$ 1.250.000,00 custam R$ 83,50 claramente temos uma relação entre as moedas, logo é possível criar uma cotação. (Playstation Store, 2021).

Ref:
Wikipedia [Site Institucional]. Disponível em: <https://pt.wikipedia.org/wiki/Moeda>. Acesso em: 28 abril 2021.
Playstation Store [Loja Virtual]. Disponível em: <https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D>. Acesso em: 28 abril 2021.

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do Hurb temos mais afinidade:

-   JavaScript (NodeJS)
-   Python
-   Go
-   Ruby
-   C++
-   PHP

### Requisitos:

-   Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um _pull request_.
    -   Caso você tenha algum motivo para não submeter um _pull request_, crie um repositório privado no Github, faça todo desafio na branch **main** e não se esqueça de preencher o arquivo `pull-request.txt`. Tão logo termine seu desenvolvimento, adicione como colaborador o usuário `automator-hurb` no seu repositório e o deixe disponível por pelo menos 30 dias. **Não adicione o `automator-hurb` antes do término do desenvolvimento.**
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
-   A API precisa contemplar cotações de verdade e atuais através de integração com APIs públicas de cotação de moedas

### Critério de avaliação:

-   **Organização do código**: Separação de módulos, view e model, back-end e front-end
-   **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?
-   **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?
-   **Legibilidade do código** (incluindo comentários)
-   **Segurança**: Existe alguma vulnerabilidade clara?
-   **Cobertura de testes** (Não esperamos cobertura completa)
-   **Histórico de commits** (estrutura e qualidade)
-   **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?
-   **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?

## 🏁 Getting Started: <a name = "getting_started"></a>

Abaixo uma descrição detalhada de como instalar e subir a aplicação. Não utilizei Docker, pois entendo que a complexidade de instalação é baixa.


### Prerequisites:

O único requisito para rodar o projeto é ter o Python instalado e as bibliotecas descrita no arquivo de requiremnts.txt. Nesse projeto foi utilizado o FastApi como framework.

```
Python 3.8
```

### Installing:

Após a instalação do, basta executar o comando abaixo dentro diretório do arquivo mencionado.

```
pip install -r requirements.txt 
```

Pronto. Tudo o que você precisa para rodar o projeto está instalado.

## 🔧 Running: <a name = "running"></a>
Para rodar o ambiente, basta acessar o diretório do projeto, no local do arquivo main.py e executar o comando abaixo:

```
uvicorn main:app --reload
```

### Exemplo:
Ao subir o server, o seu terminal vai exibir informações parecidas com essas:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [47556] using statreload
INFO:     Started server process [47558]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```


## 🎈 Usage: <a name="usage"></a>

### Siginup:

  - A primeira coisa a se fazer é inscrever-se na plataforma para ter acesso aos recursos de conversão, criação e deleção de moedas.

### Login: 
  - Efetue o login para obter o "acess_token" que será utilizado nas outras chamadas da API (Bearer Token).

Toda a documentação de uso da API está descrita no link: [Documentacao API](http://127.0.0.1:8000/docs#/) . Você consgue acessá-la após subir a aplicação, descrito na etapa de [Running](#running).


## 🚀 Development: <a name = "development"></a>

### Security:
- Como medida de segurança, implementei um sistema de autenticação de usuários utilizando jwt. A "key" tem um tempo de uso de 30 minutos. Após 

### Database:
- O banco de dados utilizado para essa solução foi o SQLite3. A escolha se deu para facilitar o uso e atender os requisitos necessários sem a complexidade de uma conexão e instalação de um postgres (ou qualquer outro banco de dados relacional).
- Ao iniciar a aplicação (veja em: [Running](#running)), um banco de dados (currencyConversionDatabase.db) será criado automaticamente dentro da pasta do Projeto. As tabelas que vão ser usadas na solução também são criadas nesse momento.

## ⛓️ Vulnerabilities: <a name = "vulnerabilities"></a>
- Uma falha que não consegui resolver, foi derrubar a "secret_key" do usuário quando ele estiver logado e a aplicação para efetuar um "reload". A meu ver toda a aplicação deveria parar e o usuário deveria efetuar o login novamente.

- Outra falha pontual é a falta de criptografia na senha do usuário. Quem tiver acesso ao banco, pode visualizar a senha de qualquer usuário criado.

## Comments: <a name = "comments"></a>
- Os arquivos de database.py e jwt.py são os únicos que contem códigos que não foram feitos por mim.
- Esta faltando a parte da cobertura de testes.
- Como o desafio técnico é de Backend, não fazia sentido pra mim, criar um front para interagir com a API.
