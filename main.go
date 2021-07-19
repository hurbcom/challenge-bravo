package main

import (
	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/router"
)

func main() {
	database.RunMigrations()
	router.Run()
}