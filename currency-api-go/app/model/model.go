// Define a estrutura do banco de dados e realiza a comunicação.
package model

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"github.com/EltonARodrigues/currency-api-go/app/config"
)

// Struct da tabela do banco.
type Currency struct {
	gorm.Model   `json:"-"`
	Code      string  `gorm:"type:varchar(3);unique;not null json:"code"`
	Usd_value float64 `gorm:"not null json:"usd_value"`

}

// Realiza a migração
func dbMigrate(db *gorm.DB) *gorm.DB {
	db.AutoMigrate(&Currency{})
	fakeDefaultValues(db)
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

// Inserir dados fakes para test
func fakeDefaultValues(db *gorm.DB){

	currencys := []Currency{
		{Code:"USD", Usd_value: 1.0},
		{Code:"BRL", Usd_value: 0.24},
		{Code:"EUR", Usd_value: 1.1},
		{Code:"ETH", Usd_value: 170.42},
		{Code:"BTC", Usd_value: 9607.82},
	}

	for _, c := range currencys {
		err := getCurrencyOr404(c.Code, db)
		if err == nil {
			db.Create(&c)
		}
	}
}

func getCurrencyOr404(code string, db *gorm.DB) *Currency {
	var currency Currency
	if err := db.First(&currency, Currency{Code: code}).Error; err != nil {
		return nil
	}
	return &currency
}
