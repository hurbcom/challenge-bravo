<p align="center">
  <a href="https://www.hurb.com/br" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Logo-hurb-azul.png" width="280" alt="Hurb" /></a>
</p>

## Bravo Challenge
Esta aplicação faz parte do teste de habilidade e competências técnicas da Hurb.

O objetivo principal é a construção de uma API que possibilite a conversão entre moedas com valores reais e ficticios.

É possível consultar a [documentação da API](https://hurb-bravo-challenge.herokuapp.com/docs) e realizar testes a partir do endpoint
https://hurb-bravo-challenge.herokuapp.com/

## Ferramentas e bibliotecas 🔨
- [Nestjs](https://docs.nestjs.com/)
- [TypeORM](https://docs.nestjs.com/)
- [Nestjs Seeder](https://github.com/edwardanthony/nestjs-seeder)
- [Swagger](https://swagger.io/docs/)

## Executando a aplicação 🚀

##### Clone o repositório e execute os passos de configuração
Dentro do repositório há um arquivo .env.example que deve ser referência para a criação do arquivo de ambiente.

Há também um arquivo .env com as configurações de ambiente, caso queira executar a aplicação em um banco de dados Postgres local
altere as configurações de conexão de acordo com a base de dados que queira utilizar (lembre-se de criar a base de dados).

##### Instalando dependências
```bash
# Instalar dependências
yarn install
```
##### Executando Migrations
```bash
# Executar migrations
yarn typeorm migration:run
```
Certo! agora que o banco de dados foi configurado é possível inserir dados fictícios para fins de testes
##### Executando Seeders
```bash
# Executar seeders
yarn seed:run
```
Prontinho! agora a aplicação já está configurada e populada para desenvolvimento.

### Executando com docker 🐋
Este projeto também foi configurado para ser utilizado com o Docker.
Para isto, basta manter as configurações de banco de seu arquivo .env com os dados de .env.example
##### Construindo as imagens
```bash
# Construir imagem
docker-compose build
```
##### Executando container
```bash
# Executar container
docker-compose up
```
Pronto! agora o projeto estará disponível para desenvolvimento.

## Executando testes 🔎

```bash
# Testes unitários
$ npm run test

# Testes e2e
$ npm run test:e2e

# Testar cobertura
$ npm run test:cov
```

