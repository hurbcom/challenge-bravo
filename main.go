package main

import (
	"context"
	"fmt"
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/infra"
	"log"
)

func main() {
	infra.LoadInfra()
	gateway.LoadGateways()

	pong, err := infra.GetRedisCacheConnection().Ping(context.Background()).Result()
	fmt.Println(pong, err)

	err = infra.GetMongoDatabaseConnection().Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	price, err := gateway.GetAwesomeApiClient().GetPrice("BRL", "USD")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(price)
}
