package database

import (
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

var database *gorm.DB;

type Currency struct {
	gorm.Model

	Code string `gorm:"unique"`
	IsReal bool
	ExchangeRate float64
}

func connection() *gorm.DB {
	if (database != nil) {
		return database
	}

	database, error := gorm.Open(mysql.Open(os.Getenv("DATA_SOURCE_NAME")), &gorm.Config{})
	if error != nil {
		panic("Failed to connect database")
	}

	return database
}

func RunMigrations() {
	connection().AutoMigrate(&Currency{})
}

func StoreCurrency(currency *Currency) {
	connection().Create(&currency)
}

func GetExchangeRate(code string) float64 {
	var currency Currency
	connection().Where("code = ?", code).First(&currency)
	
	return currency.ExchangeRate
}