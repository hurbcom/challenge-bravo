# API para conversão de moedas

## Descrição
API construída utilizando princípios de domain driven design junto do microframework para web em Ruby chamado [Roda](https://github.com/jeremyevans/roda) com [Sequel](https://github.com/jeremyevans/sequel) como ORM.

Para as cotações utilizei a API do [Cryptocompare](https://www.cryptocompare.com/)

# Dependências
- Ruby
- PostgresSQL

# Uso

1. Instalar bibliotecas
Com Ruby e o Postgres já instalados, seguir esses passos:
```zsh
bundle install
```
4. Adicionar as variáveis de ambiente. O projeto tem um arquivo `.env.example` que pode ser utilizada como as configs.
```zsh
mv .env.example .env
```
3. Criar o banco de dados, migrar e popular
```zsh
rake db:create && rake db:migrate && rake db:seed
```
4. Carregar o aplicativo
```zsh
rackup
```

Pronto! Agora a api estará exposta na porta `9292`.

# Testes

Para rodar os testes, ir para a raiz do projeto e rodar o comando:
```
rspec
```

# TODO
 - Apesar de eu ter iniciado a configuração dos containeres docker, acabei que tive alguns problemas no meu sistema operacional e fiquei sem tempo de ajeitar os containeres como desejava.
 - Aumentar a cobertura de testes. Como utilizei esse desafio como uma maneira  de aprendizedo, acabei testando apenas algumas classes e não cheguei a construir os testes de integração para a API. Como utilizei um microframework, eu precisaria investir mais tempo para preparar o ambiente corretamente para simular os testes de integração.
 - Melhor maneira de configurar a gem `Money` para adicionar novas criptomoedas. Utilizei a gem `Money` para realizar as operações com as moeadas porém ela nao tem as criptomoeads configuradas por padrão, para tal precisei configurar na mão e hoje essas configs estão hard coded quando poderiam estar em uma tabela de configuração.
 - Cache em memória para aumentar a performance. Como o projeto depende de uma api externa, o ideal seria cachear os request para aumentar a performance e diminuir a chance de ter o limite de requests estourado.
