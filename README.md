# Desafio Bravo

Foi constru�do uma API em ASP.NET que � capaz de converter moedas com cota��es atuais.

#Inicializando
� necess�rio a utiliza��o do Visual Studio e de uma inst�ncia de SQL, neste caso foi utilizado SQL EXPRESS.

1 - Dentro do projeto, abrir o arquivo **Web.config** e alterar a **connectionStrings**, passando a string de conex�o:
- connectionString="Server=localhost\SQLEXPRESS;Database=bdCurrency;Trusted_Connection=True;"

2 -  Abrir o **Package manager console** do visual studio e inserir o comando: "add-migration initialCreate" .

3 - Ao fim do add-migration, inserir o comando "update-database".

4 -Abrir o postman e fazer as requisi��es

#Uso
Para fazer a convers�o de uma moeda,  � necess�rio que antes ela seja inserida no banco de dados atrav�s deu um POST. (USD, BRL, EUR, BTC e ETH j� est�o inclu�das, n�o � necess�rio fazer um post nesse caso.) Exemplo de objeto: 
- { base: "EUR", value: 0.000 }

#Endpoints
- GET: api/currency
Retorna todas as moedas cadastradas no banco.

- GET: api/currency?from=USD&To=BRL&amount=100
Realiza convers�o das moedas

- PUT: api/currency?cur={base da moeda. Ex: "USD"}
-- Body: { base: "USD", value: 0.000 }

- POST:  api/currency
-- Body: { base: "USD", value: 0.000 }

#Em caso de erro could not get response:
1 - No Package manager console do visual estudio inserir o comando: dotnet dev --certs https --trust
2 - No postman, ir nas configura��es ->General -> desabilitar SSL certificate verification
