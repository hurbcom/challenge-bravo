para iniciar a aplicação basta executar o comando <b>docker-compose up</b>

Por padrão a aplicação ira ser executada no caminho localhost:5000.

As seguintes moedas serão criadas assim que a aplicação for iniciada pela primeira vez:
<ul>
    <li>USD
    <li>BRL
    <li>EUR
    <li>BTC
    <li>ETH
</ul>

<p>A moeda USD não podera ser altera e nem excluida, pois os valores de todas as outras moedas são basedas nela</p>

<h3> Criando Moedas </h3>
<p><b> POST: http://localhost:5000</b></p>
<p>Deve ser enviado no corpo da requisição</p>

```
{
    "name":"COIN",
    "price":0.18
}
```

<p>lembrando que o campo price deve ser baseado na cotação do dolar Americano</p>

<br>
<h3> Atualizando Moedas </h3>
<p><b> PUT: http://localhost:5000/{name}</b></p>
<p>Deve ser enviado no corpo da requisição</p>

```
{
    "price":0.18
}
```

<br>
<h3> Listando Moedas </h3>
<p><b> GET: http://localhost:5000</b></p>
<p>recebera a seguinte lista</p>

```
[
    {
        "id": "d37c337d-92f1-4d24-b9af-548995c5adfe"
        "name": "BRL",
        "price": 0.18,
    },
    {
        "id": "d57c337d-92f1-3d24-b9ac-548995c5adfa"
        "name": "USD",
        "price": 1,
    },
]
```

<p>pode ser enviado como filtro via query params o nome da moeda, ex. ?name=BRL</p>


<br>
<h3> Excluindo Moedas </h3>
<p><b> DELETE: http://localhost:5000/{name}</b></p>
<p>se tudo ocorrer bem, recebera uma resposta com status 200</p>

<br>
<h3> Convertendo Valores</h3>
<p><b> DELETE: http://localhost:5000/calculate</b></p>
<p>Deve ser enviado via query params os seguintes campos</p>
<ul>
    <li>from: Moeda de origem para o calculo
    <li>to: moeda que será calculada
    <li>amount: valor a ser calculado
</ul>
<p>Todos os 3 campos são obrigatorios, se tudo ocorrer bem, recebera o seguinte resultado</p>

```
{
    {"result": 0.18}
}
```











