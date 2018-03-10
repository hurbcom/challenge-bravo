Serviço que consome uma API para conversão de moedas. (http://api.promasters.net.br/cotacao/v1/valores) <br/>
Moedas suportadas:<br/>
- USD
- BRL
- EUR
- BTC
- ARS
- GBP

A requisição recebe como parâmetro: a moeda de origem, o valor a ser convertido e a moeda final.<br/>
Ex:</br> 
requisição: `convert/?from=BTC&to=EUR&amount=123.45`</br>
resposta: `{"response":0.00012592088534731728}`

O serviço roda na porta 5000, portante certifique-se que a mesma se encontra disponível :-)

<b>Dockerfile</b></br>
Executar o seguintes comandos no diretório raiz do projeto:
docker build -t NOME_DA_IMAGEM .
docker run -p 5000:5000 -d NOME_DA_IMAGEM

Após isso, execute um GET http na porta 5000 passando os parâmetros desejados.
