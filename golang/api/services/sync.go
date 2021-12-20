package services

import (
	"api/models"
	"api/utils"
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/shopspring/decimal"
)

var Ctx = context.Background()

// Init sync exchange historical rates with external API values and redis database
// Will be executed in a interval time
func StartSync(db *sql.DB, interval time.Duration, rdb *redis.Client) {
	ticker := time.NewTicker(interval)
	done := make(chan bool)
	for {
		select {
		case <-done:
			log.Println("Sync error occur")
			return
		case <-ticker.C:
			syncErr := syncExternalApi(db, rdb)
			if syncErr != nil {
				done <- true
				log.Println(syncErr)
			}
		}
	}
}

// Sync all currency codes with external API data and MySQL exchange historical rates
func syncExternalApi(db *sql.DB, rdb *redis.Client) error {
	// Get currency codes save
	fromcurrency, err := models.GetCurrencyCodes(db, "")
	if err == nil {
		var from, to string
		for fromcurrency.Next() {
			err := fromcurrency.Scan(&from)
			if err == nil {
				// Get all other currency codes in database to mount from-to
				tocurrency, err := models.GetCurrencyCodes(db, from)
				if err == nil {
					for tocurrency.Next() {
						err := tocurrency.Scan(&to)
						if err == nil {
							SyncCurrencyCode(db, rdb, from, to)
						}
					}
				}
			}
		}
	}

	return err
}

// Sync currency codes and create exchange rates
func SyncCurrencyCode(db *sql.DB, rdb *redis.Client, from, to string) error {
	rates := models.ExternalApiRates{}
	var exchangeRates []models.ExchangeRate
	// URL to access external API
	apiUrl := "https://freecurrencyapi.net/api/v2/latest?apikey=1b50e330-58e1-11ec-87d5-5bf2584da504&base_currency=" + from
	// Get real data values from external API
	rates, err := utils.GetRealRate("GET", apiUrl)
	if err == nil {
		if val, ok := rates.Data[to]; ok {
			// Check and save currency code if not exists
			err = models.SaveCurrencyCode(db, from)
			if err == nil {
				// Remove old values saved in database
				err = models.DeleteExchangeHistoricalRates(db, from+"-"+to)
				if err == nil {
					// Correcting the external API bitcoin exchange rate
					if from == "BTC" {
						val = val.Mul(decimal.NewFromInt(1000))
					}
					exchangeRate := append(exchangeRates, models.ExchangeRate{Code: from + "-" + to, Historical: time.Unix(rates.Query.Timestamp, 0).Format("2006-01-02 15:04:05"), Rate: val})
					curencyCode := models.CurrencyCode{Code: from, Rates: exchangeRate}
					// Insert new values in database
					err = models.SaveExchangeHistoricalRates(db, curencyCode)
					if err == nil {
						cacheErr := cacheExchangeHistoricalRate(db, rdb, from, to)
						if cacheErr != nil {
							log.Println(cacheErr)
						}
					}
				}
			}
		} else {
			// Get exchange historical date to fictitious currency code
			_, err := models.GetExchangeHistoricalRates(db, from, to)
			if err == nil {
				cacheErr := cacheExchangeHistoricalRate(db, rdb, from, to)
				if cacheErr != nil {
					log.Println(cacheErr)
				}
			}
		}
	}

	return err
}

// Save cache historical exchange rates in redis database
func cacheExchangeHistoricalRate(db *sql.DB, rdb *redis.Client, from, to string) error {
	// Get historical exchange rates
	var exchangerates []models.ExchangeRate
	code := from + "-" + to
	exchangerates, err := models.GetExchangeHistoricalRates(db, from, to)
	if err == nil {
		// Check cache
		_, err := rdb.Get(Ctx, code).Result()
		if err == redis.Nil {
			log.Println(code + " not found")
		} else if err != nil {
			log.Println(err)
		}

		for _, exchangerate := range exchangerates {
			jsonExcR, err := json.Marshal(&exchangerate)
			if err == nil {
				// Save cache to expire in 3 minutes
				err = rdb.Set(Ctx, code, jsonExcR, 3*time.Minute).Err()
				if err != nil {
					log.Println(err)
				}
			}
		}
	}

	return err
}
