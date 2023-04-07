package main

import (
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/infra"
)

func main() {
	infra.LoadInfra()
	gateway.LoadGateways()

	/*pong, err := infra.GetRedisCacheConnection().Ping(context.Background()).Result()
	  fmt.Println(pong, err)

	  price, err := gateway.GetAwesomeApiClient().GetPrice("BRL", "USD")
	  if err != nil {
	  	fmt.Println(err)
	  }

	  fmt.Println(price)*/
}
