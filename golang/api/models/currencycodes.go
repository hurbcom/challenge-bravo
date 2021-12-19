package models

import (
	"context"
	"database/sql"
	"log"
	"strings"
	"time"
)

type CurrencyCode struct {
	Code  string         `json:"code"`
	Rates []ExchangeRate `json:"rates,omitempty"`
}

type CurrenciesCode struct {
	Data []CurrencyCode `json:"data"`
}

// Create or update currency code in database
func SaveCurrencyCode(db *sql.DB, currencyCode string) error {
	var idcode int
	currencyCode = strings.ToUpper(currencyCode)
	err := db.QueryRow("SELECT idcode FROM currency_codes WHERE code = ?;", currencyCode).Scan(&idcode)
	if err == nil || err == sql.ErrNoRows {
		if idcode > 0 {
			query := "UPDATE currency_codes SET code = ?, updated_at = NOW() WHERE idcode = ?;"
			ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancelfunc()

			stmt, err := db.PrepareContext(ctx, query)
			if err != nil {
				log.Printf("Error %s when preparing SQL statement", err)
				return err
			}
			defer stmt.Close()

			res, err := stmt.ExecContext(ctx, currencyCode, idcode)
			if err != nil {
				log.Printf("Error %s when update row into currency_codes table %s", err, currencyCode)
				return err
			}
			rows, err := res.RowsAffected()
			if err != nil {
				log.Printf("Error %s when finding rows affected", err)
				return err
			}
			log.Printf("%d currency_codes updated to %s", rows, currencyCode)
		} else {
			query := "INSERT INTO currency_codes( code ) VALUES(?);"
			ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancelfunc()

			stmt, err := db.PrepareContext(ctx, query)
			if err != nil {
				log.Printf("Error %s when preparing SQL statement", err)
				return err
			}
			defer stmt.Close()

			res, err := stmt.ExecContext(ctx, currencyCode)
			if err != nil {
				log.Printf("Error %s when inserting row into currency_codes table %s", err, currencyCode)
				return err
			}
			rows, err := res.RowsAffected()
			if err != nil {
				log.Printf("Error %s when finding rows affected", err)
				return err
			}
			log.Printf("%d currency_codes created to %s", rows, currencyCode)
		}
	} else {
		log.Printf("Error %s when check currency code exists", err)
	}

	return nil
}

// Delete currency code from database
func DeleteCurrencyCode(db *sql.DB, currencyCode string) error {
	var idcode int
	currencyCode = strings.ToUpper(currencyCode)
	err := db.QueryRow("SELECT idcode FROM currency_codes WHERE code = ?;", currencyCode).Scan(&idcode)
	if err != nil {
		log.Printf("currency code %s not exists", currencyCode)
	} else {
		query := "DELETE FROM currency_codes WHERE idcode = ?;"
		ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancelfunc()

		stmt, err := db.PrepareContext(ctx, query)
		if err != nil {
			log.Printf("Error %s when preparing SQL statement", err)
			return err
		}
		defer stmt.Close()

		res, err := stmt.ExecContext(ctx, idcode)
		if err != nil {
			log.Printf("Error %s when delete row into currency_codes table %s", err, currencyCode)
			return err
		}
		rows, err := res.RowsAffected()
		if err != nil {
			log.Printf("Error %s when finding rows affected", err)
			return err
		}
		log.Printf("%d currency_codes deleted to %s", rows, currencyCode)
	}

	return nil
}

// Get currency codes all or except
func GetCurrencyCodes(db *sql.DB, code string) (*sql.Rows, error) {
	var currencyCodes *sql.Rows
	var err error
	if code != "" {
		// Get all currency codes except from
		currencyCodes, err = db.Query("SELECT code FROM currency_codes WHERE code <> ?;", code)
	} else {
		// Get all currency codes
		currencyCodes, err = db.Query("SELECT code FROM currency_codes;")
	}

	return currencyCodes, err
}
