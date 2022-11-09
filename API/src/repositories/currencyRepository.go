package repositories

import (
	"api/src/config"
	"api/src/database"
	"api/src/models"
	"encoding/json"
	"fmt"
)

func GetCurrencyByName(currencyName string) (models.Currency, error) {

	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	var currency models.Currency

	dbResultJSON, err := redisClient.Get(currencyName).Result()
	if err != nil {
		fmt.Println("error getting currency from database:", err)
		return currency, err
	}

	err = json.Unmarshal([]byte(dbResultJSON), &currency)
	if err != nil {
		fmt.Println("error unmarshalling dbResultJSON:", err)
	}

	return currency, nil
}

func InsertCurrency(currency models.Currency) {

	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	currencyJSON, err := json.Marshal(currency)

	if err != nil {
		fmt.Println(err)
	}

	err = redisClient.Set(currency.Name, currencyJSON, 0).Err()

	if err != nil {
		fmt.Println(err)
	}
}
