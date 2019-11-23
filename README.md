# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo
## Problem
Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

##  💻 Quick start


1. Clone repo 

    `warning look the path to not overwrite an existent project`

    ```sh
    git clone https://github.com/128423/challenge-bravo.git $GOPATH/src/github.com/hurbcom/challenge-bravo
    ```
    ```sh
    cd $GOPATH/src/github.com/hurbcom/challenge-bravo 
    ```

2. Install Dep for dependences

     ```sh
     go get -u github.com/golang/dep/cmd/dep
     ```
    more info ?
    > https://github.com/golang/dep
3. Install dependencies

    ```sh
    dep ensure
    ```
4. Run

    ```sh
    go run main.go
    ```

## :whale: Run with Docker

1. Clone repo 

    `warning look the path to not overwrite an existent project`

    ```sh
    git clone https://github.com/128423/challenge-bravo.git 
    ```
    ```sh
    cd challenge-bravo
    ```
    ```sh
    make docker
    ```





### :wrench: Test
  1. Run Test
      ```sh
      go test ./...
      ```
### 📝 Docs
 > http://localhost:8080/docs/index.html

 ####  🔨 Generate
 1. Install Swaggo
    ```sh
     go get -u github.com/swaggo/swag/cmd/swag
     ```
 2. Write the docs on contollers
    ```go
    //CreateCoin Delete a Coin in the pool
    // @Tags coin
    // @Summary  Index coin
    // @Description Delete a Coin in the pool
    // @Accept json
    // @Produce json
    // @param Request path string true "Request symbol"
    // @Success 200 {object} models.Coin
    // @Failure 400 {object} models.DefaultError
    // @Router /coin [DELETE]
    func DeleteCoin(c *gin.Context) {}
    ```
 3. Generate

    ```sh
    swag init
    ````
 3. Path da documentação 

    `/docs/index.html`

## :chart_with_downwards_trend: Benchmark

1. List coins
    ```
    Bombarding http://127.0.0.1:8080/coin with 100000 request(s) using 125 connection(s)
    100000 / 100000 [=============================] 100.00% 3869/s 25s
    Done!
    Statistics        Avg      Stdev        Max
    Reqs/sec      3875.02    1635.56    9711.15
    Latency       32.25ms    18.83ms   206.19ms
    HTTP codes:
        1xx - 0, 2xx - 100000, 3xx - 0, 4xx - 0, 5xx - 0
        others - 0
    Throughput:     1.05MB/s
    ```

2. Price conversion
    ```
    Bombarding http://127.0.0.1:8080/price-conversion?from=USD&to=brl&amount=92 with 100000 request(s) using 125 connection(s)
    100000 / 100000 [==============================] 100.00% 2217/s 45s
    Done!
    Statistics        Avg      Stdev        Max
    Reqs/sec      2224.91    1885.03   11373.28
    Latency       56.12ms    72.84ms      1.90s
    HTTP codes:
        1xx - 0, 2xx - 99952, 3xx - 0, 4xx - 0, 5xx - 48
        others - 0
    Throughput:   633.26KB/s
    ```