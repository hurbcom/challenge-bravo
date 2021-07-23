package database

import (
	"github.com/gustavowiller/challengebravo/models"
)

// Execute the migrations database Mysql relates the model Currency
func RunMigrations() {
	database := Connect()
	database.AutoMigrate(&models.Currency{})

	sqlDB, _ := database.DB()
	sqlDB.Close()
}
