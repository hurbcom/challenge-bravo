package sync

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/danielmalka/challenge-bravo/application/currency/repository"
	"github.com/danielmalka/challenge-bravo/pkg/external"
	"github.com/danielmalka/challenge-bravo/pkg/storage"
	"gorm.io/gorm"
)

const dateLayout = "02/01/2006 15:04:05"

type APIResult struct {
	Result             string             `json:"result"`
	Documentation      string             `json:"documentation"`
	TermsOfUse         string             `json:"terms_of_use"`
	TimeLastUpdateUnix int64              `json:"time_last_update_unix"`
	TimeLastUpdateUTC  string             `json:"time_last_update_utc"`
	TimeNextUpdateUnix int64              `json:"time_next_update_unix"`
	TimeNextUpdateUTC  string             `json:"time_next_update_utc"`
	BaseCode           string             `json:"base_code"`
	ConversionRates    map[string]float64 `json:"conversion_rates"`
}

func SyncCurrencies(userPass, host, schema, path string) {
	// Create an instance of the HTTP client
	client := external.NewClient(&http.Client{
		Timeout: 10 * time.Second,
	})

	// Make the GET request to get the currencies
	response, err := client.DoRequest(http.MethodGet, path, nil)
	if err != nil {
		log.Println("Error making GET request:", err)
		return
	}

	// Parse the response into the APIResult struct
	var result APIResult
	if err := json.Unmarshal(response, &result); err != nil {
		log.Println("Error unmarshalling response:", err)
		return
	}

	// connect to the database
	db, err := storage.ConnectMysql(userPass, schema, host)
	if err != nil {
		log.Println("sync - error connecting to database: ", err)
		return
	}

	lastUpdateDate := time.Unix(result.TimeLastUpdateUnix, 0) // gives unix time stamp in utc

	// Loop APIResult and insert into the database
	for code, rate := range result.ConversionRates {
		var currency repository.Currency
		err := db.First(&currency, "code = ?", code).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newCurrency := createNewCurrencyFromConversionRate(code, rate)
			newCurrency.UpdatedAt = lastUpdateDate
			if err := db.Create(&newCurrency).Error; err != nil {
				log.Println("error creating currency: ", err, newCurrency)
			}
			continue
		}

		if currency.UpdatedAt.Before(lastUpdateDate) {
			currency_rate := fmt.Sprintf("%v", rate)

			if notEmpty(currency_rate) {
				currency.CurrencyRate = currency_rate
			}

			currency.UpdatedAt = lastUpdateDate

			if result := db.Save(&currency).Error; result != nil {
				log.Println("error updating currency: ", result, currency)
			}
		}
	}

	defer storage.Close(db, true)
}

func createNewCurrencyFromConversionRate(code string, rate float64) repository.Currency {
	backingCurrency := false
	strRate := fmt.Sprintf("%v", rate)
	if code == "USD" {
		backingCurrency = true
	}
	return repository.Currency{
		Code:            code,
		Name:            code,
		BackingCurrency: backingCurrency,
		CurrencyRate:    strRate,
	}
}

func notEmpty(s string) bool {
	return strings.TrimSpace(s) != ""
}
