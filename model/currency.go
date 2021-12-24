package model

import (
	"database/sql"
	sq "github.com/Masterminds/squirrel"
)

type CurrencyType string

const (
	RealCurrency   CurrencyType = "C"
	CryptoCurrency CurrencyType = "Y"
	CustomCurrency CurrencyType = "U"
)

type Currency struct {
	Code      string          `json:"code" validate:"required,max=3"`
	Name      string          `json:"name" validate:"required,max=100"`
	Type      CurrencyType    `json:"type,omitempty" validate:"oneof=C Y U"`
	Rate      sql.NullFloat64 `json:"rate" validate:"required_if=Type U,gt=0"`
	daoHelper `json:"-" redis:"-" validate:"-"`
}

func (curr *Currency) List(values interface{}) error {

	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Select("code", "type", "name", "rate").
		From("currency").
		OrderBy("code")

	if err := curr.list(&builder, values, func(entity interface{}) string {
		return "CUR." + entity.(*Currency).Code
	}); err != nil {
		return err
	}
	return nil
}

func (curr *Currency) Save() error {

	builder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar).
		Insert("currency").
		Columns("code", "type", "name", "rate").
		Values(curr.Code, curr.Type, curr.Name, curr.Rate).
		Suffix("ON CONFLICT currency_pkey DO UPDATE SET type=$2,name=$3,rate=$4;")

	if err := curr.save(&builder, "CUR."+curr.Code, curr); err != nil {
		return err
	}

	return nil
}

func (curr *Currency) String() string {
	return curr.daoHelper.string(curr)
}
