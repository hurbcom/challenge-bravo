# Desafio Bravo

Foi construído uma API em ASP.NET que é capaz de converter moedas com cotações atuais.

#Inicializando
É necessário a utilização do Visual Studio e de uma instância de SQL, neste caso foi utilizado SQL EXPRESS.

1 - Dentro do projeto, abrir o arquivo **Web.config** e alterar a **connectionStrings**, passando a string de conexão:
- connectionString="Server=localhost\SQLEXPRESS;Database=bdCurrency;Trusted_Connection=True;"

2 -  Abrir o **Package manager console** do visual studio e inserir o comando: "add-migration initialCreate" .

3 - Ao fim do add-migration, inserir o comando "update-database".

4 -Abrir o postman e fazer as requisições

#Uso
Para fazer a conversão de uma moeda,  é necessário que antes ela seja inserida no banco de dados através deu um POST. (USD, BRL, EUR, BTC e ETH já estão incluídas, não é necessário fazer um post nesse caso.) Exemplo de objeto: 
- { base: "EUR", value: 0.000 }

#Endpoints
- GET: api/currency
Retorna todas as moedas cadastradas no banco.

- GET: api/currency?from=USD&To=BRL&amount=100
Realiza conversão das moedas

- PUT: api/currency?cur={base da moeda. Ex: "USD"}
-- Body: { base: "USD", value: 0.000 }

- POST:  api/currency
-- Body: { base: "USD", value: 0.000 }

#Em caso de erro could not get response:
1 - No Package manager console do visual estudio inserir o comando: dotnet dev --certs https --trust
2 - No postman, ir nas configurações ->General -> desabilitar SSL certificate verification
