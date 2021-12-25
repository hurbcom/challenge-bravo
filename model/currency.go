package model

import (
	"challenge-bravo/model/dao"
	sq "github.com/Masterminds/squirrel"
)

type CurrencyType string

const (
	RealCurrency   CurrencyType = "C"
	CryptoCurrency CurrencyType = "Y"
	CustomCurrency CurrencyType = "U"
)

// Currency Represents a currency, could be a real currency, a crypt currency or a custom currency, created by a user
type Currency struct {
	Code       string          `json:"code" validate:"required,max=3,uppercase"` // Code Currency ISO code
	Name       string          `json:"name" validate:"required,max=100"`         // Name Currency name
	Type       CurrencyType    `json:"type,omitempty" validate:"oneof=C Y U"`    // Type Currency type
	Rate       dao.NullFloat64 `json:"rate" validate:"required_if=Type U,gt=0"`  // Rate Currency USD rate, required for custom type only
	dao.Helper `json:"-" redis:"-" validate:"-"`
}

func (curr *Currency) New() error {

	// Entity validation
	if err := curr.Validate(); err != nil {
		return err
	}

	// Query prepare
	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Insert("currency").
		Columns("code", "type", "name", "rate").
		Values(curr.Code, curr.Type, curr.Name, curr.Rate)

	// Persist to database and cache
	return curr.Helper.Save(&builder, "CUR."+curr.Code, curr)
}

func (curr *Currency) Save() error {

	// Entity validation
	if err := curr.Validate(); err != nil {
		return err
	}

	// Query prepare
	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Insert("currency").
		Columns("code", "type", "name", "rate").
		Values(curr.Code, curr.Type, curr.Name, curr.Rate).
		Suffix("ON CONFLICT ON CONSTRAINT currency_pkey DO UPDATE SET type=$2,name=$3,rate=$4;")

	// Persist to database and cache
	return curr.Helper.Save(&builder, "CUR."+curr.Code, curr)
}

func (curr *Currency) List(values interface{}) error {

	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Select("code", "type", "name", "rate").
		From("currency").
		OrderBy("code")

	return curr.Helper.List(&builder, values, func(entity interface{}) string {
		return "CUR." + entity.(*Currency).Code
	})
}

func (curr *Currency) Validate() error {
	return dao.Validator.Struct(curr)
}

func (curr *Currency) String() string {
	return curr.Helper.String(curr)
}
