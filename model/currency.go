package model

import (
	"challenge-bravo/dao"
	"challenge-bravo/helper"
	"fmt"
	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgerrcode"
	"log"
	"net/http"
)

type CurrencyType string

const (
	RealCurrency   CurrencyType = "C"
	CryptoCurrency CurrencyType = "Y"
	CustomCurrency CurrencyType = "U"
)

// Currency Represents a currency, could be a real currency, a crypt currency
// or a custom currency, created by a user
type Currency struct {
	Code       string       `json:"code"`           // Code Currency ISO code
	Name       string       `json:"name"`           // Name Currency name
	Type       CurrencyType `json:"type,omitempty"` // Type Currency type
	Rate       *float64     `json:"rate,omitempty"` // Rate Currency USD rate, required for custom type only
	dao.Helper `json:"-" redis:"-"`
}

func (curr *Currency) New() *dao.Error {

	// Entity validation
	if err := curr.Validate(); err != nil {
		return err
	}

	// Prepare the query
	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Insert("currency").
		Columns("code", "type", "name", "rate").
		Values(curr.Code, curr.Type, curr.Name, curr.Rate)

	// Persist to database and cache
	if err := curr.Helper.Save(&builder, "CUR."+curr.Code, curr); err != nil {
		return prepareCurrencyErrors(err)
	}

	// Invalidate currency list cache
	_ = dao.Cache.Del("CUR.=LIST=")

	return nil
}

func (curr *Currency) Save() *dao.Error {

	// Entity validation
	if err := curr.Validate(); err != nil {
		return err
	}

	// Prepare the query
	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Insert("currency").
		Columns("code", "type", "name", "rate").
		Values(curr.Code, curr.Type, curr.Name, curr.Rate).
		Suffix("ON CONFLICT ON CONSTRAINT currency_pkey DO UPDATE SET type=$2,name=$3,rate=$4;")

	// Persist to database and cache
	if err := curr.Helper.Save(&builder, "CUR."+curr.Code, curr); err != nil {
		return prepareCurrencyErrors(err)
	}

	// Invalidate currency list cache
	_ = dao.Cache.Del("CUR.=LIST=")

	return nil
}

func (curr *Currency) List(values interface{}) *dao.Error {

	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Select("code", "type", "name", "rate").
		From("currency").
		OrderBy("code")

	if err := curr.Helper.List(&builder, values, "CUR.=LIST=", func(entity interface{}) string {
		return "CUR." + entity.(*Currency).Code
	}); err != nil {
		return prepareCurrencyErrors(err)
	}
	return nil
}

func (curr *Currency) Validate() *dao.Error {

	err := dao.Error{
		Message:    "Invalid currency object",
		StatusCode: http.StatusBadRequest,
	}

	// Check if the code exists
	if len(curr.Code) == 0 {
		err.Append(fmt.Sprintf("code: code is a required field, for crypto currencies and custom currencies must have from one to ten characters long and for real currencies three characters long"))
	}

	// Check if the code is uppercase
	if !helper.IsValidCryptoCode(curr.Code) {
		err.Append(fmt.Sprintf("code: currency code must be upper case: %s", curr.Code))
	}

	// Check currency name
	if len(curr.Name) == 0 {
		err.Append(fmt.Sprintf("name: currency name is a required field, must have from one to one hundred characters long"))
	}
	if len(curr.Name) > 100 {
		err.Append(fmt.Sprintf("name: currency name must have from one to one hundred characters long, was provided a string with %d characters", len(curr.Name)))
	}

	switch curr.Type {
	case RealCurrency:

		// Check code length
		if len(curr.Code) != 3 {
			err.Append(fmt.Sprintf("code: currency code for real currencies must be three characters long, was provideda a string with %d characters: %s", len(curr.Code), curr.Code))
		}

		// Check if the code contains only letters
		if !helper.IsLetter(curr.Code) {
			err.Append(fmt.Sprintf("code: currency code for real currencies must contain only letters: %s", curr.Code))
		}

		// Check rate
		if curr.Rate != nil {
			err.Append(fmt.Sprintf("rate: USD conversion rate should be null for real currencies: %.2f", *curr.Rate))
		}

	case CustomCurrency:

		// Check code length
		if len(curr.Code) > 10 {
			err.Append(fmt.Sprintf("code: currency code for custom currencies must have from one to ten characters long, was provideda a string with %d characters: %s", len(curr.Code), curr.Code))
		}

		// Check rate
		if curr.Rate == nil {
			err.Append(fmt.Sprintf("rate: USD conversion rate should be valid and greather than zero for custom currencies"))
		} else {
			if *curr.Rate <= 0 {
				err.Append(fmt.Sprintf("rate: USD conversion rate should be valid and greather than zero for custom currencies: %.2f", *curr.Rate))
			}
		}

	case CryptoCurrency:
		// Check code length
		if len(curr.Code) > 10 {
			err.Append(fmt.Sprintf("code: currency code for crypto currencies must have from one to ten characters long, was provideda a string with %d characters: %s", len(curr.Code), curr.Code))
		}

		// Check rate
		if curr.Rate != nil {
			err.Append(fmt.Sprintf("rate: USD conversion rate should be null for real currencies: %.2f", *curr.Rate))
		}

	default:
		err.Append(fmt.Sprintf("type: currency type must be one of the following values: %s - real currence; %s - crypto currency; %s - custom currency", RealCurrency, CryptoCurrency, CustomCurrency))

		// Check code length
		if len(curr.Code) > 10 {
			err.Append(fmt.Sprintf("code: currency code for custom or crypto currencies must have from one to ten characters long and for real currencies three chracters long, was provideda a string with %d characters: %s", len(curr.Code), curr.Code))
		}
	}
	if len(err.Errors) == 0 {
		return nil
	} else {
		return &err
	}
}

func (curr *Currency) String() string {
	return curr.Helper.String(curr)
}

func (curr *Currency) Load() *dao.Error {

	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Select("code", "type", "name", "rate").
		From("currency").
		Where(sq.Eq{"code": curr.Code})

	if err := curr.Helper.Get(&builder, curr, "CUR."+curr.Code); err != nil {
		return prepareCurrencyErrors(err)
	}

	return nil
}

func (curr *Currency) Delete() *dao.Error {

	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Delete("currency").Where(sq.Eq{"code": curr.Code})

	// Delete from database/cache
	if err := curr.Helper.Delete(&builder, "CUR."+curr.Code); err != nil {
		return prepareCurrencyErrors(err)
	}

	// Invalidate currency list cache
	_ = dao.Cache.Del("CUR.=LIST=")

	return nil
}

// SaveCurrencies Save a vector of currencies to the database and cache
func SaveCurrencies(currencies []Currency) *dao.Error {

	// Prepare the query
	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Insert("currency").
		Columns("code", "type", "name")
	for _, cur := range currencies {

		// Validates the actual currency and if it's ok put at the insert statement
		if err := cur.Validate(); err == nil {

			// Append to the query
			builder = builder.Values(cur.Code, cur.Type, cur.Name)

			// Save currency to cache
			if cErr := dao.Cache.Set("CUR."+cur.Code, cur, dao.DefaultCacheTime); cErr != nil {
				log.Println(cErr)
			}
		} else {
			log.Println(err)
		}
	}
	builder = builder.Suffix("ON CONFLICT ON CONSTRAINT currency_pkey DO NOTHING;")

	// Execute the query
	if err := dao.Save(&builder); err != nil {
		return prepareCurrencyErrors(err)
	}
	return nil
}

// prepareCurrencyErrors Generates error objects for currency persist operations
func prepareCurrencyErrors(err error) *dao.Error {

	switch t := err.(type) {
	case *pgconn.PgError:
		if t.Code == pgerrcode.UniqueViolation {
			return &dao.Error{
				Message:    "currency code already exist",
				StatusCode: http.StatusConflict,
			}
		}
		return &dao.Error{
			Message:    http.StatusText(http.StatusInternalServerError),
			StatusCode: http.StatusInternalServerError,
		}
	default:
		msg := t.Error()
		if msg == "no rows in result set" {
			return &dao.Error{
				Message:    fmt.Sprintf("currency not fount"),
				StatusCode: http.StatusNotFound,
			}
		}
		return &dao.Error{
			Message:    http.StatusText(http.StatusInternalServerError),
			StatusCode: http.StatusInternalServerError,
		}
	}
}
