package main

import (
    "context"
    "fmt"
    "github.com/VictorNapoles/challenge-bravo/src/gateway"
    "github.com/VictorNapoles/challenge-bravo/src/infra"
)

func main() {
    infra.LoadInfra()
    gateway.LoadGateways()

    pong, err := infra.GetRedisCacheConnection().Ping(context.Background()).Result()
    fmt.Println(pong, err)

    price, err := gateway.GetAwesomeApiClient().GetPrice("BRL", "USD")
    if err != nil {
        fmt.Println(err)
    }

    fmt.Println(price)
}
