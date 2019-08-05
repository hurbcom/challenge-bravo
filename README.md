# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

# Api de conversão de moedas

## Pré-requisitos
- Docker (ou Docker for Windows): https://docs.docker.com/install/

## Instruções para configuração/instalação
A aplicação roda dentro de uma imagem docker, portanto todo o ambiente é instalado diretamente através da mesma.

### Configuração
A configuração do sistema é baseada nos valores do arquivo de configurações `src/application/settings.py`
| Chave | Descrição | Valor padrão |
| --- | --- | --- |
| FLASK_SERVER_NAME | Configura host e porta da aplicação (desenvolvimento)* | 'localhost:5000' |
| FLASK_DEBUG | Flag de debug da aplicação flask | False |
| RESTPLUS_SWAGGER_UI_DOC_EXPANSION | Formato de expansão da doc do swagger | 'list' |
| RESTPLUS_MASK_SWAGGER | Reduz verbosidade do swagger frente ao restplus (https://flask-restplus.readthedocs.io/en/stable/mask.html) | False |
| RESTPLUS_ERROR_404_HELP | Configura página de erro 404 do Restplus | False |
| MOCK_CURRENCY_PROVIDER | Flag para mockar a API de conversão de moeda CurrencyLayer(envolve gastos) | True |
| CURRENCY_LAYER_API_KEY | Chave de acesso à API CurrencyLayer| <secret> |

* Para alteração do host e porta de PRD, consultar arquivo `bootstrap.sh`
*TODO* parametrizar host e porta de maneira geral, separada por ambientes (via CD pipeline seria o ideal)

### Instalação
Os comandos a seguir criam e rodam a aplicação dentro de uma imagem docker. Dentro da pasta raiz do repositório:
  - `docker-compose build --no-cache` - Cria imagem chamada brunofurmon/challenge-bravo:1.0
  - `docker-compose up` - Executa imagem e continua escutando a saída da aplicação na sessão de terminal atual (e cria se o passo anterior não tiver sido executado previamente)

## Testes
Para executar os testes de unidade da aplicação, são necessários os seguintes pacotes:
### Dependências
- python3 (via apt ou brew)
- python3-pip (via apt ou brew)

Executar os seguintes comandos
`pip3 install pipenv` instala o ambiente virtual do python 3
`pip3 install pytest`
`pipenv install` instala as dependências da aplicação na máquina do desenvolvedor

### Execução dos testes
- Dentro da pasta raiz do repositório, executar
`python3 -m pytest`

## Documentação do endpoint de conversão
A chamada está documentada no formato swagger através do endereço http://localhost:5000/api 

Endpoint da chamada de conversão:
`http://localhost:5000/api/currency/convert`
Parâmetros:
- from*: string
- to*: string
- amount*: string

* obrigatórios

Ex.: `http://localhost:5000/api/currency/convert?from=BTC&to=EUR&amount=123.45`

## Escolhas técnicas

### Framework
Foi utilizado o flask com restplus para criação de um micro serviço com um único endpoint e com suporte a rotas/documentação do mesmo através de decorators.
### Deploy Method
Docker foi utilizado para simplicidade de criação e execução de um ambiente isolado e replicável.
### Integração para conversão de moedas
Foi utilizada a api CurrencyLayer (https://currencylayer.com/). Escolha baseada nas moedas requeridas pelo desafio e também na quantidade de chamadas permitidas em uma subscription gratuita.
É possível desligá-la através da chave de configuração *MOCK_CURRENCY_PROVIDER*=True (valor padrão).
A chave da minha subscription (gratuita, com cerca de 200 requisições restantes) segue junto do código.
A api permite uma conexão segura e está com certificado SSL OK até o momento (2019/08/05)
Apesar de gratuita, a api não fornecia um endpoint de conversão direto (apenas na subscrição paga). Por isso, foi necessário realizar uma lógica de conversão para possibilitar qualquer conversão. No endpoint fornecido, a origem é sempre USD, mas a moeda de destino pode ser qualquer uma dentre as +suportadas. Para saber quais, consulte `src/integrations/currencyconversion/currencylayer.py`

Caso o usuário opte por não utilizar a biblioteca externa, um Mock da mesma foi criado, contendo todas as conversões necessárias para as moedas do desafio, baseadas em uma requisição do dia 2019/09/05.
### Lib de testes
Para execuçao dos testes no formato unittest, foi utilizado o pytest, por facilitar a separação da pasta de testes da pasta de código, reduzindo o pacote copiado para dentro da imagem docker.

## Links
https://docs.docker.com
https://flask-restplus.readthedocs.io/en/stable/
https://swagger.io/
https://docs.pytest.org/en/latest/
https://currencylayer.com/


## Débitos! (TODO)
Ficou faltando embarcar na API um arquivo de testes de carga (Jmeter) ou K6s (https://github.com/loadimpact/k6)
 