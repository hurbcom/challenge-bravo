package repositories

import (
	"api/src/config"
	"api/src/database"
	"api/src/models"
	"encoding/json"
	"fmt"

	"github.com/go-redis/redis"
)

func GetCurrencyByName(currencyName string) (models.Currency, error) {

	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	var currency models.Currency

	dbResultJSON, err := redisClient.Get(currencyName).Result()

	if err == redis.Nil {
		fmt.Println("no results found for key", currencyName)
		return models.Currency{}, err
	}

	if err != nil {
		fmt.Println("error getting currency from database:", err)
		return models.Currency{}, err
	}

	err = json.Unmarshal([]byte(dbResultJSON), &currency)
	if err != nil {
		fmt.Println("error unmarshalling dbResultJSON:", err)
	}

	return currency, nil
}

func InsertCurrency(currency models.Currency) error {

	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	currencyJSON, err := json.Marshal(currency)

	if err != nil {
		return err
	}

	err = redisClient.Set(currency.Name, currencyJSON, 0).Err()

	if err != nil {
		return err
	}

	return nil
}
