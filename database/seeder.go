package database

import (
	"github.com/gustavowiller/challengebravo/models"
)

func SeederCurrencies() {
	database := Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	/**
	* This code prevents the seeder from creating duplicates
	* It only works at early stage creation of database
	*/
	var totalCurrencies int64
	database.Model(&models.Currency{}).Count(&totalCurrencies)
	if (totalCurrencies > 0) {
		return
	}

	currencies := []models.Currency{
		models.Currency{
			Code: "USD",
			IsReal: true,
		},
		models.Currency{
			Code: "BRL",
			IsReal: true,
		},
		models.Currency{
			Code: "EUR",
			IsReal: true,
		},
		models.Currency{
			Code: "BTC",
			IsReal: true,
		},
		models.Currency{
			Code: "ETH",
			IsReal: true,
		},
	}

	for _, currency := range currencies {
		database.Create(&currency)
	}
}
