#INSTALAÇÃO

- Docker atráves do site https://www.docker.com/products/docker-desktop
- Artillery atráves do site https://artillery.io/docs/getting-started/ ou npm install -g artillery
- Express-rate-limit atráves do site https://www.npmjs.com/package/express-rate-limit 

#COMPILAR O PROJETO

- npm start (para rodar o projeto)
- npm test (para testar o número de requisições suportadas pela API)

#OBS

- Toda as chamadas possuem autenticação e para obter o token basta fazer uma chamada GET a API "/authenticate" e passar o Authorization via header a partir das outras chamadas 
- A biblioteca do Artillery foi utilizada para realizar o teste de carga na API principal "/currencies" que é responsável por fazer as conversões das moedas
- Na API "/currency-convert" é possível fazer a conversão da moedas e do respectivo valor Ex: 
- Na API "/currency-suported" é possível adicionar e remover moedas a partir do json Ex: "{"coin": "EUA", "action": "add"}" no parâmetro action é necessário passar o valor "add" (adiciona moeda) ou "remove" (remover moeda).
- Para utilizar o docker basta executar "sudo docker-compose up"
