package main

import (
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/infra"
	"github.com/VictorNapoles/challenge-bravo/presenter"
	"github.com/VictorNapoles/challenge-bravo/usecase"
)

// @title           Currency and quote Service
// @version         1.0
// @description     A currency and quote management service API in Go using Gin framework.

// @contact.name   Victor de Nápoles
// @contact.url    https://www.linkedin.com/in/victor-n%C3%A1poles-84b61a32/
// @contact.email  victornapoles@hotmail.com

// @host      localhost:8080
func main() {
	infra.LoadInfra()
	gateway.LoadGateways()
	usecase.LoadUsecases()
	presenter.LoadPresenters()
}
