package model

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type Currency struct {
	gorm.Model
	Name	  string  `json:"name"`
	Usd_value float64 `json:"usd_value"`

}

// DBMigrate will create and migrate the tables, and then make the some relationships if necessary
func DBMigrate(db *gorm.DB) *gorm.DB {
	db.AutoMigrate(&Currency{})
	return db
}