package database

import (
	"os"

	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

func Connect() *gorm.DB {
	database, error := gorm.Open(mysql.Open(os.Getenv("DATA_SOURCE_NAME")), &gorm.Config{})
	if error != nil {
		panic("Failed to connect database")
	}

	return database
}