Oi pessoal, terminei o desafio.

Como solicitado, para rodar o projeto seguem os passos:

- git clone https://github.com/diegodesousas/challenge-bravo
- cd challenge-bravo
- make install
- make up (Aguarde a mensagem "Hurb app is fully up on http://localhost:8000" )
- make seed (em uma novo terminal)
- comece a usar :)

Para rodar os testes
- make test

Cobertura do código fica no diretório `coverage`  

Considerações

- A parte mais importante do código está dentro do diretório `app/Core`
- Adicionei alguns comandos customizados para melhorar a inicialização da aplicação que estão no diretório `app/Console`
- `Controller`, `Models`, `Exceptions`, optei por manter os padrões do framework
- Exportei um projeto do Insomnia com todas as request da API.

API
- POST /currency (body {'code': 'USD'})
- DELETE /currency/{code}
- GET /currency/convert?from=USD&to=BRL&amount=100