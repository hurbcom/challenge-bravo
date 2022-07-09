# Desafio Bravo
## _API de conversão monetária_

Para a criação dessa solução, utilizei .NET Core e banco de dados SQLite em um docker. 

## Fluxo da solução

- Consumo da API [OpenExchangeRates] para importação das cotações de moedas.
- Inserção dos dados das moedas na base de dados.
- Solicitações feitas via interface por usuários no endPoint Cotacao.
- Retorto das solicitações baseado no cálculo dos valores de cotação das moedas armazenados na base.

## Tecnologias
- [.NET Core] - Utilizei .NET Core pela familiaridade com a linguagem.
- [Entity Framework] - Utilizei Entity Framework para mapear o banco de dados em objetos para .NET.
- [SQLite] - Utlizei SQLite para persistir novas moedas a API para otimizar o desenvolvimento e ter uma maior disponibilidade se comparado ao serviço externo.
- [Angular]	- Utilizei Angular no Front-end por ter um pouco de familiaridade.
- [Docker] - Utilizei Docker para dar suporte à OS Linux.
- [XUnit] - Utilizei o XUnit para realizar testes unitários de integração.


## Instalação
### Docker
`Obs:` Necessário instalação do [Docker Desktop]

Criar a imagem docker da pasta DesafioBravo.BackEnd
```
docker build -t desafiobravo:v1 .
```
Iniciar a imagem Docker
```
docker run -it --rm -p 8080:80 desafiobravo:v1
```

### FrontEnd
`Obs:` para testar o backend via interfase, é necessáio instalar o [NodeJS]

Ir para o diretório do projeto principal da solução:
```
$ cd challenge-bravo\src\DesafioBravo\DesafioBravo.FrontEnd
```
Instalar as depências do projeto:

```
npm install
```
Rodar o projeto para testes
```
npm run start
```
Acessar o endereço do FrontEnd
```sh
http://localhost:4200/
```

## Possíveis falhas
Não utiliza um sistema de autenticação, logo é possível que qualquer pessoa adicione ou remova uma moeda.

[OpenExchangeRates]: <https://openexchangerates.org>
[.NET Core]: <https://docs.microsoft.com/pt-br/dotnet/core/introduction>
[SQLite]: <https://sqlite.org/index.html>
[Angular]: <https://angular.io/>
[Docker]: <https://www.docker.com/>
[Docker Desktop]: <https://www.docker.com/products/docker-desktop/>
[Entity Framework]: <https://docs.microsoft.com/pt-br/ef/>
[XUnit]: <https://xunit.net/> 
[NodeJS]: <https://nodejs.org/en/>
