package controllers

import (
	"api/models"
	"api/services"
	"api/utils"
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"strings"

	"github.com/go-redis/redis/v8"
)

var Ctx = context.Background()

// Get exchange rates converted according data input by users
func GetExchangeRatesConverter(db *sql.DB, rdb *redis.Client, from, to, amount string) (models.ExchangeRates, error) {
	// Default values method return
	var exchangerates []models.ExchangeRate
	var exchangerateconvert models.ExchangeRate
	var exchangerate models.ExchangeRates
	var err error
	from = strings.ToUpper(from)
	to = strings.ToUpper(to)

	// Get all exchage rates from currency code
	if to == "ALL" {
		var to string
		// Get all currency codes to check except from
		tocurrency, err := models.GetCurrencyCodes(db, from)
		if err == nil {
			for tocurrency.Next() {
				err := tocurrency.Scan(&to)
				if err == nil {
					// Check key exists in cache
					historical, err := rdb.Get(Ctx, from+"-"+to).Result()
					// Cache not found
					if err == redis.Nil || err != nil {
						services.SyncCurrencyCode(db, rdb, from, to)
						historical, _ := rdb.Get(Ctx, from+"-"+to).Result()
						// Use saved data cache
						err = json.Unmarshal([]byte(historical), &exchangerateconvert)
						if err != nil {
							log.Printf("unmarshal historical data error %s", err)
						} else {
							// Create object to endpoint result
							err := utils.ConvertAmountToDecimal(amount, &exchangerateconvert)
							if err == nil {
								exchangerates = append(exchangerates, exchangerateconvert)
							}
						}
					} else {
						err = json.Unmarshal([]byte(historical), &exchangerateconvert)
						if err != nil {
							log.Printf("unmarshal historical data error %s", err)
						} else {
							// Create object to endpoint result
							err := utils.ConvertAmountToDecimal(amount, &exchangerateconvert)
							if err == nil {
								exchangerates = append(exchangerates, exchangerateconvert)
							}
						}
					}
				}
			}
		}
	} else {
		// Check key exists in cache
		historical, err := rdb.Get(Ctx, from+"-"+to).Result()
		// Cache not found
		if err == redis.Nil || err != nil {
			err = services.SyncCurrencyCode(db, rdb, from, to)
			if err != nil {
				log.Printf("cache not found, sync error %s", err)
			}
			historical, _ := rdb.Get(Ctx, from+"-"+to).Result()
			// Use saved data cache
			err := json.Unmarshal([]byte(historical), &exchangerateconvert)
			if err == nil {
				// Create object to endpoint result
				err := utils.ConvertAmountToDecimal(amount, &exchangerateconvert)
				if err == nil {
					exchangerates = append(exchangerates, exchangerateconvert)
				}
			}
		} else {
			// Use saved data cache
			err := json.Unmarshal([]byte(historical), &exchangerateconvert)
			if err == nil {
				// Create object to endpoint result
				err := utils.ConvertAmountToDecimal(amount, &exchangerateconvert)
				if err == nil {
					exchangerates = append(exchangerates, exchangerateconvert)
				}
			}
		}
	}

	exchangerate = models.ExchangeRates{Data: exchangerates}

	return exchangerate, err
}
