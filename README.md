
## <img  src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg"  alt="Hurb"  width="24" /> Desenvolvimento da solução para o Desafio Bravo

O objetivo do desafio é o desenvolvimento de uma API que responde em JSON uma conversão monetária.

Para a criação dessa solução, utilizei o framework ASPNET Boilerplate sobre a paltaforma .NET 5 e banco de dados PostgreSQL em um docker.
O fluxo básico da solução consiste em:
1. Importa as cotações do serviço de Cotação de Moedas em Awesome API;
2. Insere ou atualiza esses dados na base de dados.;
3. O usuário solicita a cotação através do endpoint ConverterMoedas
4. A aplicação busca na base de dados a cotação de cada moeda e realiza o cálculo a partir dos valores que estão armazenados na base.

Usei uma base intermediária para armazenar as cotações em dólar para que houvesse uma maior disponibilidade do serviço, independendo de instabilidade de APIs terceiras. Assim, caso a API terceira não consiga atualizar os dados da base de dados, o nosso serviço ainda estará funcional e oferecendo a última cotação que foi armazenada no banco de dados.

Sobre a atualização, ela ocorre de forma assíncrona a cada chamada de conversão de moedas, assim a aplicação não cria um "lock" na requisição. Mesmo a operação de importação levar pouco tempo de execução, a ideia dessa abordagem é pensando em um cenário onde há centenas de moedas fictícias. Dessa forma, a importação tende a levar mais tempo.

Um dos recursos que costumo utilizar para automatizar esse processo de importação de dados a partir de outras APIs é o hangfire, que é um orquestrador de jobs. Infelizmente, até o presente momento, não consegui implementá-lo nesse projeto, pois demanda um tempo maior de testes, pois mesmo sendo um dos mais utilizados em ambiente .NET, ele apresenta alguns problemas quando utilizado em bancos não-SQL Server.

Em termos de arquitetura da solução, utilizei o modelo de Domain Driven Design, onde, neste framework, se divide basicamente em 3 partes: Application Service, Managers das Classes e seus repositórios.
<img src="https://raw.githubusercontent.com/mattvidal/challenge-bravo/main/img/abp-concerns.png" alt=“Hurb” width=“24” />

Tentei agrupar a maior parte das regras de negócio na camada de Managers, onde ocorrem as interações com o banco de dados a partir dos repositórios implementados com o auxílio do Entity Framework. Para expor esses métodos para a camada de aplicação, usei as Application Services que basicamente chamam os métodos expostos pelas interfaces dos Managers, e assim, interage com o usuário e/ou outras aplicações. Esse tráfego de dados é feito com a o auxílio dos DTOs criados na camada de aplicação.

Para auxiliar no processo de importação e consulta de recursos externos, criei um AppService chamado ServiceAppService e seu respectivo DTO.

A aplicação permite que sejam feitas conversões das seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH
 

Entretanto, é possível cadastrar moedas realizando um POST no seguinte endpoint: `/api/services/app/Moeda/Inserir`
Estrutura do JSON:
```
{
  "nome": "string",
  "codigo": "string",
  "valorUSD": 0,
  "id": 0
}
```

Para importar todas as cotações da Awesome API, se faz necessário fazer um POST no endpoint: 
`/api/services/app/Moeda/ImportarCotacoes`

Além disso, para viabilizar o CRUD na aplicação, foram crios os seguintes endpoints:

<img src="https://raw.githubusercontent.com/mattvidal/challenge-bravo/main/img/swagger3.png" alt=“Hurb” width=“24” /> 

## Tecnologias utilizadas

  - .NET 5
  - PostgreSQL
  - Docker
  - [Dillinger](https://dillinger.io/) - editor de markdown.

### Instalação e execução

Realizar o clone do repositório:
```
$ python -m venv env
```
Instalar o .NET 5 pelo snap, suas configurações, subir o banco de dados pelo docker-compose, realizar as migrations para a base e por fim, executar o comando para subir o projeto:
```
$ sudo snap install dotnet-sdk --classic --channel=5.0 && sudo snap alias dotnet-sdk.dotnet dotnet && export DOTNET_ROOT=/snap/dotnet-sdk/current && sudo dotnet tool install --local dotnet-ef && sudo docker-compose up -d && sudo dotnet ef database update && sudo dotnet run --project ChallengeBravo.Web.Host.csproj
```
Abrir no navegador a seguinte url:
```
$ http://localhost:21021/
```
Por questões de segurança, é necessário realizar o login pelo Swagger ou pelo endpoint:
`/api/TokenAuth/Authenticate`
Estrutura do JSON:
```
{
  "userNameOrEmailAddress": "admin",
  "password": "123qwe",
  "rememberClient": true
}
```
Com isso, a requisição retornará um accesstoken, que deverá ser utilizando no header das demais requisições, com authorization do tipo Bearer Token.

A forma mais fácil é pelo próprio Swagger. Basta preencher os dados de usuário e senha, deixando o tenant em branco. Assim, poderá utilizar todos os métodos expostos na documentação.

<img src="https://raw.githubusercontent.com/mattvidal/challenge-bravo/main/img/swagger1.png" alt=“Hurb” width=“24” />

<img src="https://raw.githubusercontent.com/mattvidal/challenge-bravo/main/img/swagger2.png" alt=“Hurb” width=“24” />

Para deixar o ambiente com pelo menos todas as moedas iniciais, por favor, chame o endpoint de importação de cotações: 
Para fazer as migrações ao banco de dados, execute: `/api/services/app/Moeda/ImportarCotacoes`
