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

## Instalação

Para realizar a instalação basta seguir os passos abaixos:

1 - Crie um Projeto novo e Clone o Diretório:<br>https://github.com/c4rl0s4nt0s/challenge-bravo.git <br><br>
2 - Realize a Instalação dos Requisitos através do comando:<br><i>pip install -r requirements.txt</i> <br><br>
3 - Basta Executar o arquivo <b>"start.sh"</b>, abaixo o endereço do endpoint:<br>
<b>http://127.0.0.1:8000/Currency/ </b>

## Utilização

Abaixo está a lista de serviços existentes e suas respectivas chamadas:<br><br>

    _________________________________________________________________

    * Função: Converter Moedas (Currency Exchange);
    * Endereço: http://127.0.0.1:8000/Currency/?from=USD&to=BRL&amount=10;
    * Método: GET;
    * Retorno Esperado:
        "{\"From\": \"USD\", \"To\": \"BRL\", \"Amount\": \"10\", \"FinalValue\": \"49.80\"}"
    _________________________________________________________________

    * Função: Retornar Lista de Moedas (Currency List);
    * Endereço: http://127.0.0.1:8000/;
    * Método: GET;
    * Retorno Esperado:
        [
            {
                "id": 1,
                "symbolAlias": "USD",
                "nameDescription": "Dólar",
                "baseUsdValue": "1.0000",
                "typeCurrency": 1,
                "lastUpdateDate": "2021-06-24T10:17:46.020838Z",
                "quotationDate": "2021-06-24T21:00:01Z"
            },
            {
                "id": 2,
                "symbolAlias": "BRL",
                "nameDescription": "Real",
                "baseUsdValue": "4.9800",
                "typeCurrency": 1,
                "lastUpdateDate": "2021-06-24T10:17:46.057814Z",
                "quotationDate": "2021-06-24T21:00:01Z"
            }
        ]
    _________________________________________________________________

    * Função: Inserir Uma Nova Moeda (Currency Insert);
    * Endereço: http://127.0.0.1:8000/;
    * Método: POST;
    * Estrutura de Dados:
        "symbolAlias": "Abreviatura da Moeda (BRL,USD,BTC)",
        "nameDescription": "Nomenclatura Descritiva",
        "baseUsdValue": "Valor da Moeda Perante ao Lastro (USD/XXX)",
        "typeCurrency": "Tipo da Moeda, Caso 1 - Moedas Reais, 2 - Ficticias"

    * Estrutra Envio:
        {
            "symbolAlias": "USD",
            "nameDescription": "Dólar Americano",
            "baseUsdValue": 1,
            "typeCurrency": 1
        }
    _________________________________________________________________

    * Função: Alterar Informações de Moedas (Currency Update);
    * Endereço: http://127.0.0.1:8000/<id>;
    * Método: PUT;
    * Tipo de Dados:
        "symbolAlias": "Abreviatura da Moeda (BRL,USD,BTC)",
        "nameDescription": "Nomenclatura Descritiva",
        "baseUsdValue": "Valor da Moeda Perante ao Lastro (USD/XXX)",
        "typeCurrency": "Tipo da Moeda, Caso 1 - Moedas Reais, 2 - Ficticias"

    * Estrutra Envio:
        {
            "id": 1,
            "symbolAlias": "USD",
            "nameDescription": "Dólar",
            "baseUsdValue": "1.0000",
            "typeCurrency": 1,
            "lastUpdateDate": "2021-06-24T10:17:46.020838Z",
            "quotationDate": "2021-06-24T21:00:01Z"
        }
    _________________________________________________________________

    * Função: Remover Moedas da Base (Currency Delete);
    * Endereço: http://127.0.0.1:8000/<id>;
    * Método: DELETE;

## Observações Gerais

Por restrições técnicas não foi possível a realização da instalação do Docker em Máquina.
assim, ficando como melhoria para futuras atualizações, também deixo como sugestão os seguintes pontos:

* Definição de um provedor de DataMarket (exchangerate-api), assim como sua periodicidade de atualização:<br><br>
* Estabelecer a períodicidade de atualização bem como categorizar por prioridades;
* Caso a demanda seja acima da pré-estabelicida nos testes, é recomendável a utilização de bancos não relacionais;

