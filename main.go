package main

import (
	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/config"
	"github.com/gustavowiller/challengebravo/router"
	"github.com/gustavowiller/challengebravo/services"
)

func main() {
	config.Load()
	database.RunMigrations()
	go services.HourlyUpdateExchangeRates()
	router.Run()
}