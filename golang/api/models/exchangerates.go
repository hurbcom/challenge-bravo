package models

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/shopspring/decimal"
)

/* Historical exchange rate */
type ExchangeRate struct {
	Code       string          `json:"code"`
	Historical string          `json:"historical"`
	Rate       decimal.Decimal `json:"rate"`
	Amount     string          `json:"amount,omitempty"`
}

/* Endpoint result */
type ExchangeRates struct {
	Data []ExchangeRate `json:"data"`
}

// Get exchange historical rates data in MySQL
func GetExchangeHistoricalRates(db *sql.DB, from, to string) ([]ExchangeRate, error) {
	var historical, code string
	var rate decimal.Decimal
	var exchangerate []ExchangeRate
	from = strings.ToUpper(from)
	to = strings.ToUpper(to)
	// Get all historical exchange rate data
	if to == "ALL" {
		rows, err := db.Query("SELECT code, rate, DATE_FORMAT( historical, '%d/%m/%Y' ) FROM exchange_historical_rates WHERE code LIKE ?;", from+"-%")
		if err != nil {
			return exchangerate, err
		}

		for rows.Next() {
			err = rows.Scan(&code, &rate, &historical)
			if err == nil {
				exchangerate = append(exchangerate, ExchangeRate{Code: code, Historical: historical, Rate: rate})
			}
		}
	} else {
		// Get specific historical exchange rate data
		err := db.QueryRow("SELECT rate, DATE_FORMAT( historical, '%d/%m/%Y' ) FROM exchange_historical_rates WHERE code = ?;", from+"-"+to).Scan(&rate, &historical)
		if err != nil {
			return exchangerate, err
		}
		exchangerate = append(exchangerate, ExchangeRate{Code: from + "-" + to, Historical: historical, Rate: rate})
	}

	return exchangerate, nil
}

// Create or update exchange historical rates in database
func SaveExchangeHistoricalRates(db *sql.DB, exchangerates CurrencyCode) error {
	for _, exchangerate := range exchangerates.Rates {
		var exists int
		var code string
		if exchangerate.Rate.IsZero() {
			exchangerate.Rate = decimal.NewFromFloat(1.00000)
		}

		if exchangerates.Code == "" {
			return fmt.Errorf("%s", "Currency code is empty ")
		}

		if strings.Contains(exchangerate.Code, "-") {
			code = strings.ToUpper(exchangerate.Code)
		} else {
			code = strings.ToUpper(exchangerates.Code + "-" + exchangerate.Code)
		}

		err := db.QueryRow("SELECT COUNT(*) FROM exchange_historical_rates WHERE code = ?", code).Scan(&exists)
		if err == nil {
			if exists == 1 {
				query := "UPDATE exchange_historical_rates SET rate = ?, historical = NOW(), updated_at = NOW() WHERE code = ?;"
				ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancelfunc()

				stmt, err := db.PrepareContext(ctx, query)
				if err != nil {
					log.Printf("Error %s when preparing SQL statement", err)
					return err
				}
				defer stmt.Close()
				res, err := stmt.ExecContext(ctx, exchangerate.Rate, code)
				if err != nil {
					log.Printf("Error %s when update row into exchange_historical_rates table", err)
					return err
				}
				rows, err := res.RowsAffected()
				if err != nil {
					log.Printf("Error %s when finding rows affected", err)
					return err
				}
				log.Printf("%d exchange_historical_rates created ", rows)
			} else {
				query := "INSERT INTO exchange_historical_rates( code, rate, historical, created_at ) VALUES( ?, ?, NOW(), NOW() );"
				ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancelfunc()

				stmt, err := db.PrepareContext(ctx, query)
				if err != nil {
					log.Printf("Error %s when preparing SQL statement", err)
					return err
				}
				defer stmt.Close()
				res, err := stmt.ExecContext(ctx, code, exchangerate.Rate)
				if err != nil {
					log.Printf("Error %s when inserting row into exchange_historical_rates table", err)
					return err
				}
				rows, err := res.RowsAffected()
				if err != nil {
					log.Printf("Error %s when finding rows affected", err)
					return err
				}
				log.Printf("%d exchange_historical_rates created to %s", rows, exchangerate.Code)
			}
		} else {
			log.Printf("%s\n", err)
		}
	}

	return nil
}

// Delete exchange historical rates from database
func DeleteExchangeHistoricalRates(db *sql.DB, currencyCode string) error {
	currencyCode = strings.ToUpper(currencyCode)
	query := "DELETE FROM exchange_historical_rates WHERE code LIKE ? OR code LIKE ?;"
	ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelfunc()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Printf("Error %s when preparing SQL statement", err)
		return err
	}
	defer stmt.Close()
	res, err := stmt.ExecContext(ctx, currencyCode+"-%", "%-"+currencyCode)
	if err != nil {
		log.Printf("Error %s when delete row into exchange_historical_rates table", err)
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		log.Printf("Error %s when finding rows affected", err)
		return err
	}
	log.Printf("%d exchange_historical_rates deleted to %s", rows, currencyCode)

	return err
}
