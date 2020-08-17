# API Chalenge Bravo

## API deve retornar a cotação das moedas.

A api toma como bade os dados oriundos da api **min-api.cryptocompare.com** . Os dados providos por essa api são manipulados por um servico chamado ServiceQuoteCurrencyPrice que retor na o valor da moeda atual baseado na query string amount.

## 1 Ambientes

O projeto é possui dois ambiente de dev e prod. Ambas configurações se encontram no arquivos settings.
### 1.1 Dev
No ambiente de dev usa se o cache type simple e sqlite. O docker-compose que sobe a app em dev só possui o servico flask

### 1.2 Prod

No ambiente em prod usa se o cache redis e o mysql. O docker-compose que sobe a app em possui o servico **flask , redis , mysql e webserver** . O serviço web  é uma imagen com nginx, ela foi alterada afim de obter aumento de desempenho. Suas confs se encontram na pasta nginx, onde existe o Dockerfile reponsavel pela criacao da imagem e uma pasta conf.d com os seguintes arquivos:

- conf.d:
   - app.conf
   - http.conf
   - nginx.conf

Foi adicionado na location configuração de stale cache e de proxy lock on. Exitem dois headers que retornam a informações de cache  **X-Cache-Status** e **X-CACHE-KEY**, informando o status do cache e o path cacheado


## Cache 

A aplicação possui dois nives de cache, um de FE e outro de BE . O de FE é provido pelo nginx e serve um stale caso aja algum problema no servidor de BE, e um cache 3m de http code 200. O de BE é provido pelo redis, para a resposta do metodo  calc_currency_price_by_currencies_quote  da classe ServiceQuoteCurrencyPrice. A soma dos caches é de 8 min o que garante a perfomance esperada. A key do cache de BE é formado pela junção from_currency+to_currency+str(round(amount, 2)
valor é a redondado para dois, para diminuir o scape de cache para flutuantes. Uma boa opção seria limitar o tamanho do amount. Entretanto, neste caso existe a questão da dualidade entre dominio do negocio e performance. Nesse cenario, quanto maior é o tempo de cache(range maior de valores cacheados), mais distante o valor é da realidade.

## DDD

Trabalhou se no conceito do livro de Eric Evans (DDD) na concepção da arquitetura de software. Possuindo assim a ideias de Serviços e Repositorios, que auxiliam criar uma arquitetura com alta coesão e baixo acoplamento

## Endpoints


|Método|Rotas |Query String | Parametros | Body|
|------|------------|-----------------------|-----------|-------|
|GET |/healthcheck|- |-| -|
|GET |/currency |`from={moeda}`,`to={moeda}`,`amount=1`|-|-||
|POST |/currency |-|-| `{"simbol_currency":"moeda","name_description": "descricao"}`|
|DELETE|/currency/{ID or symbol_currency}|-|`symbol_currency`,`id`|-|
|GET|/currency/all|-|-|-|


### Especificações de Requests e Responses

  - Request:

    ```bash
    curl -X GET "/currency?from=BTC&to=BRL&amount=1"
    ```

  - Response Body esperado:


## Como executar o projeto

- Para instalar e executar sem docker:
    - O código executara com as confs de dev
    - ```make install```
    - ```make migrate```
    - ```make run```

- Para instalar e executar com docker em dev:
    - ```make dev```

- Para instalar e executar com docker em prod:
    - ```make prod```

- Para instalar e executar com docker em prod e executar teste de carga:
    - ```make testecarga```

- Para **WARNING** remover containers:
    - ```make remove```
    - Esse comando executa os seguintes comandos em background e fara um clean nos volumes e imagens:
        - docker-compose stop;\
        - docker-compose down --rmi all  -v  --remove-orphans ; \
        -  docker volume prune; \
        -  docker image prune; \
- Para executar os tests sem docker:
    - ```make test ```

- Para executar os tests com docker **Não é muito recomendado para trabalho muito delay para criacao das imagens**:
    - ```make testdocker ```

- Remover a imagem de test
    -  ```make removetest```


## Teste de carga

O teste de carga gera 3 arquivos o que podera ajudar a acompanhar os resultados. Ele permanecera executando por 3m 

- desafio_failures.csv
- desafio_stats.csv
- desafio_stats_history.csv

## **Cuidados Docker**

Recomendado a cada utilização dos comandos que execute o ```make remove``` e um ```docker rmi -f $(docker images -q)```
Importante:  isso apagara todas as imagens e volumes na sua maquina
