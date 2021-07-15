package database

import (
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

func Connect() {
	data_source_name := "user:@tcp(localhost:3306)/database"
	_, error := gorm.Open(mysql.Open(data_source_name), &gorm.Config{})
	if error != nil {
		panic("Failed to connect database")
	} 
}
