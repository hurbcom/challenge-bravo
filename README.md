# Conversor de Moedas

API para conversão monetária. 
Moeda de lastro: USD.
Possível fazer conversões entre diferentes moedas

## Requisitos

- Go 1.23.3
- Docker

## Como usar?

- Clone o repositório
- Copie o arquivo .env.example para .env com o comando ```cp .env.example .env```
- Rode ```make prepare``` no terminal e aguarde a API subir na porta 8085
- Pronto! Agora você pode acessar o [Swagger](http://localhost:8085/swagger/index.htm) do projeto e verificar o resultado!

### API Conversão de Moedas


Caso você tenha interesse em acessar a API por um Postman abaixo tem a descrição das rotas.

---

#### Conversão V1

**Rota:** http://localhost:8085/v1/conversion

**Parametros:** Passados diretamente na rota
* ```from``` Moeda de onde vamos converter o valor
* ```to``` Moeda para onde vamos converter o valor
* ```amount``` Valor a ser convertido

*Exemplo:* ```?from=BRL&to=USD&amount=123.45```

---

#### Adicionar Moeda V1

**Rota:** http://localhost:8085/v1/currency

**Método:** POST

**Parâmetros:** Passados no corpo da requisição

* ```code``` Código da moeda a ser adicionada
* ```name``` Nome da moeda a ser adicionada
* ```currency_rate``` Valor referente ao valor desta moeda se comparada ao **backing_currency** (Que não está implementado e por isso é referente ao USD marretado no código)
* ```backing_currency``` Se essa é a moeda padrão do sistema (Não Implementado)

*Exemplo de corpo da requisição:*

```
    {
        "code": "HURB",
        "name": "Hurb Coin"
        "currency_rate": 1.5
        "backing_currency": false
    }
```

---

#### Remover Moeda V1

**Rota:** http://localhost:8085/v1/currency/{id}

**Método:** DELETE

**Parâmetros:** Passados diretamente na rota

* ```id``` Índice no database da moeda a ser removida

*Exemplo:* http://localhost:8085/v1/currency/165

---

#### Listar Moedas V1

**Rota:** http://localhost:8085/v1/currency

**Método:** GET

**Parâmetros:** Nenhum

*Exemplo:* http://localhost:8085/v1/currency

---

#### Atualizar Cotação V1

**Rota:** http://localhost:8085/v1/currency/{id}

**Método:** PUT

**Parâmetros:** O ```id``` é passado diretamente na rota, mas os outros são passados no corpo da requisição

* ```code``` Código da moeda a ser adicionada
* ```name``` Nome da moeda a ser adicionada
* ```currency_rate``` Valor referente ao valor desta moeda se comparada ao **backing_currency** (Que não está implementado e por isso é referente ao USD marretado no código)
* ```backing_currency``` Se essa é a moeda padrão do sistema (Não Implementado)

*Exemplo de corpo da requisição:*

```
    {
        "code": "HURB",
        "name": "Hurb Coin"
        "currency_rate": 1.8
        "backing_currency": false
    }
```

## Próximos Passos

* Adicionar testes automatizados