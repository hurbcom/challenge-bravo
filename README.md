## Executar a API
1. Instalar o docker-compose. [documentação](https://docs.docker.com/compose/install/linux/)
2. Na pasta raiz da API executar o comando
```
make docker-compose-up
```
ou
```
docker-compose up -d
```

```
make go-run
```
ou
```
go run server.go
```

## Documentação da API - Swagger

### Visualizar Documentação
- Acessar a rota [/docs](localhost:9000/docs) com a aplicação rodando

### Atualização da Documentação

1. Instalar na máquina o [go-swagger](https://goswagger.io/install.html)
2. Especificação das tags para geração automatica da documentação [aqui](https://goswagger.io/use/spec.html)
3. Executar o comando abaixo para atualizar a documentação
```
make swagger
```

## Sugestões de Melhorias

1. Restringir acesso aos endpoints de CRUD de Moedas para evitar alteração indevida
2. Incluir na documentação da API a relação dos erros que podem ser retornado
3. Refatorar as validações de erros no controller
4. Criar paginação no endpoint que lista todas as Moedas
5. Substituir ID sequencial por UUID
6. Incluir cabeçalhos HTTP de segurança
7. Incluir controle de auditoria