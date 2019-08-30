// Define a estrutura do banco de dados e realiza a comunicação.
package model

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"github.com/challenge-bravo/currency-api-go/app/config"
)

type Currency struct {
	gorm.Model
	Code      string  `gorm:"type:varchar(3);unique;not null json:"Code"`
	ValueByUSD float64 `gorm:"not null json:"usd_value"`
}

// Realiza a migração
func dbMigrate(db *gorm.DB) *gorm.DB {
	db.AutoMigrate(&Currency{})
	return db
}

func InitializeDB() *gorm.DB {
	var dialect string
	var dbURI string

	config := *config.GetConf()

	for _, c := range config.Database {
		dbURI = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=%s&parseTime=True",
			c.Username,
			c.Password,
			c.Address,
			c.Name,
			c.Charset)
		dialect = c.Dialect
	}
	db, err := gorm.Open(dialect, dbURI)
	if err != nil {
		log.Print(dbURI)
		log.Fatal("Could not connect database %s")
	}

	return dbMigrate(db)

}
