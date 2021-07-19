package database

import (
	"github.com/gustavowiller/challengebravo/models"
)

func RunMigrations() {
	database := Connect()
	database.AutoMigrate(&models.Currency{})

	sqlDB, _ := database.DB()
	sqlDB.Close()
}
