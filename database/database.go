package database

import (
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

type Currency struct {
	gorm.Model

	Code string
	IsFictional bool
	ExchangeRate float32
}

func connection() *gorm.DB {
	database, error := gorm.Open(mysql.Open(os.Getenv("DATA_SOURCE_NAME")), &gorm.Config{})
	if error != nil {
		panic("Failed to connect database")
	}

	return database
}

func RunMigrations() {
	database := connection()
	database.AutoMigrate(&Currency{})
}
