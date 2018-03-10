## Introdução
Serviço que consome uma API para conversão de moedas. (http://api.promasters.net.br/cotacao/v1/valores) <br/>
Moedas suportadas:<br/>
- USD
- BRL
- EUR
- BTC
- ARS
- GBP

## Descrição
A requisição recebe como parâmetro: a moeda de origem, o valor a ser convertido e a moeda final.<br/>
Ex:</br> 
requisição: GET `/convert/?from=BTC&to=EUR&amount=123.45`</br>
resposta: `{"response":0.00012592088534731728}`

O serviço roda na porta 5000. Portanto, caso a aplicação seja executada localmente, certifique-se que a porta esteja disponível na sua máquina.

## Docker
Executar o seguintes comandos no diretório raiz do projeto:
1. Criar a imagem NOME_DA_IMAGEM a partir do dockerfile. <br/>
docker build -t NOME_DA_IMAGEM .

2. Criar uma instância de container e associar a porta 5000 da sua máquina local para a porta 5000 exposta pelo container.<br/>
docker run -p 5000:5000 -d NOME_DA_IMAGEM

Após isso, execute um GET http na porta 5000 passando os parâmetros desejados.


