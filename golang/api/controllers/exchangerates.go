package controllers

import (
	"api/models"
	"api/services"
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"strings"

	"github.com/go-redis/redis/v8"
	"github.com/leekchan/accounting"
	"github.com/shopspring/decimal"
)

var Ctx = context.Background()

// Get exchange rates converted according data input by users
func GetExchangeRatesConverter(db *sql.DB, rdb *redis.Client, from, to, amount string) (models.ExchangeRates, error) {
	// Default values method return
	var exchangerates []models.ExchangeRate
	exchangerate := models.ExchangeRates{Data: exchangerates}
	from = strings.ToUpper(from)
	to = strings.ToUpper(to)
	ac := accounting.Accounting{
		Symbol:         "",
		Precision:      2,
		Thousand:       ".",
		Decimal:        ",",
		Format:         "",
		FormatNegative: "",
		FormatZero:     "",
	}

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
						var exchangerateconvert models.ExchangeRate
						err = json.Unmarshal([]byte(historical), &exchangerateconvert)
						if err != nil {
							// Try next result
							continue
						} else {
							// Create object to endpoint result
							amountconv, err := decimal.NewFromString(amount)
							if err == nil {
								percentage := decimal.NewFromInt(100)
								exchangerateconvert.Amount = ac.FormatMoney(amountconv.Mul(exchangerateconvert.Rate).Mul(percentage).Div(percentage))
								exchangerates = append(exchangerates, exchangerateconvert)
							}
						}
					} else {
						// Use saved data cache
						var exchangerateconvert models.ExchangeRate
						err = json.Unmarshal([]byte(historical), &exchangerateconvert)
						if err != nil {
							continue
						} else {
							// Create object to endpoint result
							amountconv, err := decimal.NewFromString(amount)
							if err == nil {
								percentage := decimal.NewFromInt(100)
								exchangerateconvert.Amount = ac.FormatMoney(amountconv.Mul(exchangerateconvert.Rate).Mul(percentage).Div(percentage))
								exchangerates = append(exchangerates, exchangerateconvert)
							}
						}
					}
				}
			}
		}

		// Create object to endpoint result
		exchangerate = models.ExchangeRates{Data: exchangerates}
	} else {
		// Check key exists in cache
		historical, err := rdb.Get(Ctx, from+"-"+to).Result()
		// Cache not found
		if err == redis.Nil || err != nil {
			err = services.SyncCurrencyCode(db, rdb, from, to)
			if err != nil {
				log.Printf("sync error %s", err)
			}
			historical, _ := rdb.Get(Ctx, from+"-"+to).Result()
			// Use saved data cache
			var exchangerateconvert models.ExchangeRate
			err := json.Unmarshal([]byte(historical), &exchangerateconvert)
			if err != nil {
				return exchangerate, err
			} else {
				// Create object to endpoint result
				amountconv, err := decimal.NewFromString(amount)
				if err == nil {
					percentage := decimal.NewFromInt(100)
					exchangerateconvert.Amount = ac.FormatMoney(amountconv.Mul(exchangerateconvert.Rate).Mul(percentage).Div(percentage))
					exchangerates = append(exchangerates, exchangerateconvert)
					exchangerate = models.ExchangeRates{Data: exchangerates}
				}
			}
		} else {
			// Use saved data cache
			var exchangerateconvert models.ExchangeRate
			err := json.Unmarshal([]byte(historical), &exchangerateconvert)
			if err != nil {
				return exchangerate, err
			} else {
				// Create object to endpoint result
				amountconv, err := decimal.NewFromString(amount)
				if err == nil {
					percentage := decimal.NewFromInt(100)
					exchangerateconvert.Amount = ac.FormatMoney(amountconv.Mul(exchangerateconvert.Rate).Mul(percentage).Div(percentage))
					exchangerates = append(exchangerates, exchangerateconvert)
					exchangerate = models.ExchangeRates{Data: exchangerates}
				}
			}
		}
	}

	return exchangerate, nil
}
