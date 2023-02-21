## Executar a Aplicação
```
make run
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

1. Restringir acesso aos endpoints de CRUD de Moedas
2. Criar paginação no endpoint que lista todas as Moedas
3. Substituir ID sequencial por UUID
4. Incluir cabeçalhos HTTP de segurança
5. Incluir controle de auditoria