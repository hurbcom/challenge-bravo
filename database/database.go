package database

import (
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

type Currency struct {
	gorm.Model

	Code string `gorm:"unique"`
	IsReal bool
	ExchangeRate float64
}

func openConnection() *gorm.DB {
	database, error := gorm.Open(mysql.Open(os.Getenv("DATA_SOURCE_NAME")), &gorm.Config{})
	if error != nil {
		panic("Failed to connect database")
	}

	return database
}

func closeConnection(database *gorm.DB) {
	sqlDB, _ := database.DB()
	defer sqlDB.Close()
}

func RunMigrations() {
	database := openConnection()
	database.AutoMigrate(&Currency{})

	closeConnection(database)
}

func StoreCurrency(currency *Currency) {
	database := openConnection()
	database.Create(&currency)

	closeConnection(database)
}

func GetExchangeRate(code string) float64 {
	var currency Currency
	database := openConnection()

	database.Where("code = ?", code).First(&currency)
	
	closeConnection(database)

	return currency.ExchangeRate
}

func DeleteCurrency(code string) {
	database := openConnection()
	database.Where("code = ?", code).Delete(&Currency{})
	closeConnection(database)
}