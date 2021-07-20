package main

import (
	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/router"
	"github.com/gustavowiller/challengebravo/services"
)

func main() {
	database.RunMigrations()
	go services.HourlyUpdateExchangeRates()
	router.Run()
}