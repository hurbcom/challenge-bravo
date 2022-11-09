package repositories

import (
	"api/src/config"
	"api/src/database"
	"api/src/models"
	"encoding/json"
	"fmt"

	"github.com/go-redis/redis"
)

func GetCurrencyConversionRateFromDatabase(currencyName string) float64 {

	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	dbResultJSON, err := redisClient.Get(currencyName).Result()
	if err != nil {
		fmt.Println("error getting currency conversion rate from database:", err)
	}

	var currency models.Currency

	err = json.Unmarshal([]byte(dbResultJSON), &currency)
	if err != nil {
		fmt.Println("error unmarshalling dbResultJSON:", err)
	}

	currencyConversionRate := currency.ConversionRate

	return currencyConversionRate
}

func IsAllowedCurrency(currencyName string) bool {
	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	_, err := redisClient.Get(currencyName).Result()

	if err == redis.Nil {
		return false
	}

	if err != nil {
		fmt.Println("error getting currency conversion rate from database:", err)
	}

	return true
}

func InsertCurrency(currency models.Currency) {

	redisClient := database.Connect()
	defer redisClient.ClientKill(config.DBPort)

	currencyJSON, err := json.Marshal(currency)

	if err != nil {
		fmt.Println(err)
	}

	//TODO Solve ID issue here - Name will be repeated
	err = redisClient.Set(currency.Name, currencyJSON, 0).Err()

	if err != nil {
		fmt.Println(err)
	}
}
