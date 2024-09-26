package entity

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
)

type Currency struct {
	CreatedAt          time.Time `json:"created_at,omitempty"`
	UpdatedAt          time.Time `json:"updated_at,omitempty"`
	CountryCode        *string   `json:"country_code,omitempty"`
	Number             *int      `json:"number,omitempty"`
	SearchURL          *string   `json:"search_url,omitempty"`
	ResponsePathToRate *string   `json:"response_path_to_rate"`
	Fic                *bool     `json:"fic,omitempty"`
	Country            *string   `json:"country,omitempty"`
	Name               string
	Code               string
	USDExchangeRate    float64
	ID                 int
	CreatedBy          int
	UpdatedBy          int
}

type CurrencyRepository interface {
	WithTx(pgx.Tx) CurrencyRepository
	Create(context.Context, Currency) (Currency, error)
	FindOneById(context.Context, int) (*Currency, error)
	FindOneByCode(context.Context, string) (*Currency, error)
	Update(context.Context, Currency) error
	Delete(context.Context, int) error
	FindAll(context.Context) ([]Currency, error)
}
