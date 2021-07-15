package database

import (
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

func Connect() {
	data_source_name := os.Getenv("DATA_SOURCE_NAME")
	_, error := gorm.Open(mysql.Open(data_source_name), &gorm.Config{})
	if error != nil {
		panic("Failed to connect database")
	} 
}
