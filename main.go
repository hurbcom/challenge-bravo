package main

import (
	"fmt"
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/infra"
	"strings"
)

func main() {
	infra.LoadInfra()
	gateway.LoadGateways()

	quotes, err := gateway.GetAwesomeApiClient().GetAvailableQuotes()
	if err != nil {
		return
	}

	for key, element := range quotes {
		if strings.HasSuffix(key, "USD") || strings.HasPrefix(key, "USD") {
			fmt.Println(fmt.Sprintf("%s - %s", key, element))
		}
	}
}
