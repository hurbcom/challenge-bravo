# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

## Descrição do projeto
Esta é uma API responsável por converter valores entre moedas (tanto moedas reais quanto fictícias). É possível também adicionar e remover moedas fictícias pela API. Todos os dados das moedas são lastreados em USD, desta forma, todos os cálculos usam o Dólar como base.

## Inicialização da aplicação
Esta aplicação utiliza conteinerização com Docker, então é necessário ter o Docker instalado para facilitar o processo de inicialização do projeto.
Para iniciar a API junto com as suas dependências de bancos de dados é necessário apenas executar o comando:
<pre><code>
docker-compose up -d
</code></pre>

## Funcionalidades

## Converter Moedas
É possível converter um valor de uma moeda para outra (tanto fictícias quanto moedas oficiais) através do endpoint `/currencies/convert` enviando um método GET com os seguintes parâmetros de query:
- `from`: Nome da moeda que deseja comparar
- `to`: Nome da moeda que seja converter o valor para
- `amount`: Quantidade de dinheiro que deseja converter para a outra moeda
Um exemplo de request seria:
<pre><code>
curl --request GET \
  --url 'http://localhost:8080/currencies/convert?from=USD&to=D%26D&amount=70'
</code></pre>

### Criar Moeda
É possível adicionar uma nova moeda fictícia através do endpoint `/currencies` enviando um método POST no seguinte formato:
```json
{
  "name": "D&D",
  "rate": 60.35
}
```
Sendo name o nome da moeda e rate o valor em USD que uma unidade da moeda representa.
Um exemplo de request seria:
<pre><code>
curl --request POST \
  --url http://localhost:8080/currencies \
  --header 'Content-Type: application/json' \
  --data '{
        "name": "D&D",
        "rate": 60.35
}'
</code></pre>

### Deletar Moeda
É possível deletar uma moeda fictícia existente no banco de dados através do endpoint `/currencies` enviando um método DELETE no seguinte formato:
`http://localhost:8080/currencies/NOME_DA_MOEDA`.
Um exemplo de request seria:
<pre><code>
curl --request DELETE \
  --url http://localhost:8080/currencies/D&D
</code></pre> 

## Sobre as Moedas e o padrão Strategy:
Dentro da API existem dois tipos de moedas possíveis: 
- Moedas reais (estas precisam ter seus valores capturados com a cotação oficial)
- Moedas fictícias (estas precisam ser armazenadas em um banco de dados da aplicação para consulta)
Vendo que uma mesma entidade precisaria ter dois tipos de algoritmo para que seus dados fossem capturados da forma correta, foi utilizado o padrão Strategy para que a regra de negócio não precisasse saber da implementação deste algoritmo e apenas pedisse para que a estratégia selecionada trouxesse o dado e a implementação da estratégia iria se encarregar de saber onde os dados devem ser pegos.

Foram criadas duas estratégias:
- `OfficialCurrencyStrategy`: Estratégia que vai buscar os valores da moeda em uma API pública com a cotação atual de dada moeda (configurável via `.env`)
- `CustomCurrencyStrategy`: Estratégia que vai buscar os valores da moeda fictícia no banco de dados da aplicação.

Ambas estratégias utilizam de caching de dados para evitar sobrecarga.

## Tecnologias utilizadas
- Golang para o Backend
- Live Reload com Air
- MongoDB para persistência
- Redis para caching
- Docker para conteinerização
- Vegeta para o teste de stress da aplicação

## Configurações do Projeto 
Dentro da pasta `/config` é possível alterar as variáveis ambientes do projeto. Estas são:
- `PORT`: Porta para qual a aplicação escutará requisições HTTP (`8080` por padrão)
- `ENVIRONMENT`: Ambiente no qual a aplicação está rodando (`local` por padrão)
- `OFFICIAL_CURRENCIES`: Moedas oficiais que a aplicação irá suportar no formato `MOEDA,OUTRAMOEDA,OUTRAMOEDA,` (`EUR,USD,BRL,BTC,ETH` são as moedas suportadas por padrão)
- `MONDODB_HOST`: Endereço para conexão com o MongoDB (`mongodb://challenge-bravo:challenge-password@mongo:27017`, ou seja, se conecta com a instância do MongoDB rodando no Docker)
- `MONGODB_DATABASE`: Banco de dados que será utilizado pela aplicação no MongoDB (`currencies` por padrão)
- `REDIS_HOST`: Endereço para conexão com o Redis (`redis:6379`, ou seja, se conecta com a instância do Redis rodando no Docker)
- `REDIS_PASSWORD`: Senha para autenticação da instancia do Redis (`challenge-bravo`, senha utilizada pela instância do Docker)
- `REDIS_TTL`: Tempo de expiração do cache em minutos (`5` por padrão)
- `CURRENCY_API_URL`: URL da API com valor atualizado das moedas oficiais (`https://api.coingate.com/api/v2/rates/merchant` por padrão)

## Testes
O projeto possui testes unitários de seus casos de uso. Para validar os testes é necessário utilizar o comando:
<pre><code>
go test -v ./... 
</code></pre>

Para validar os testes e gerar um arquivo de coverage é necessário utilizar o comando:
<pre><code>
go test -v ./... -coverprofile=coverage.txt
</code></pre>

Para gerar um arquivo html com as linhas de código cobertas pelos testes é necessário utilizar o comando:
<pre><code>
go tool cover -html=coverage.txt
</code></pre> 

### <strong>Coverage final de: `91.3%`</strong>


## Teste de Estresse
O teste de estresse da aplicação foi realizado através da ferramenta Vegeta. A aplicação foi estressada por 1 minuto com 1000 requests por segundo e conseguiu lidar com o excesso de carga com facilidade (principalmente por ter uma camada de cache não estressando a API pública e por funcionar em localhost sem latência real de rede).

O resultado foi:

<img src="assets/stress-test.png" alt="Resultado do Teste de Estresse" height=200 /> 

## Possíveis melhorias
- Rate limit na aplicação para evitar DDoS
- Autenticação para evitar com que sejam criadas moedas de forma indevida
