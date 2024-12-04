package currency

import (
	"fmt"

	"github.com/danielmalka/challenge-bravo/application/currency/repository"
)

const dateLayout = "02/01/2006 15:04:05"

// Currency - currency entity
type Currency struct {
	ID              string `json:"id"`
	Code            string `json:"code"`
	Name            string `json:"name"`
	BackingCurrency bool   `json:"backing_currency"`
	CurrencyRate    string `json:"currency_rate"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
	DeletedAt       string `json:"deleted_at"`
}

// CreateData currency info
// @Description Request to Create a new Currency
type CreateData struct {
	Code            string `json:"code" binding:"required" swaggertype:"string"`
	Name            string `json:"name" binding:"required" swaggertype:"string"`
	CurrencyRate    string `json:"currency_rate" binding:"required" swaggertype:"string"`
	BackingCurrency bool   `json:"backing_currency" default:"false" swaggertype:"boolean"`
}

// UpdateData currency info
// @Description Request to Update a Currency
type UpdateData struct {
	ID              string `json:"id" swaggerignore:"true"`
	Code            string `json:"code" binding:"required" swaggertype:"string"`
	Name            string `json:"name" binding:"required" swaggertype:"string"`
	CurrencyRate    string `json:"currency_rate" binding:"required" swaggertype:"string"`
	BackingCurrency bool   `json:"backing_currency" default:"false" swaggertype:"boolean"`
}

type UseCase interface {
	Get(id string) (*Currency, error)
	List() ([]*Currency, error)
	Create(f *CreateData) (*Currency, error)
	Update(c *Currency) (*Currency, error)
	Delete(id string) error
	GetByCodes(code ...string) ([]*Currency, error)
}

// dbToEntity converts the DB Currency struct to this Currency struct
func dbToEntity(c *repository.Currency) *Currency {
	deletedAt := ""
	if c.DeletedAt.Valid {
		deletedAt = c.DeletedAt.Time.Format(dateLayout)
	}
	return &Currency{
		ID:              fmt.Sprintf("%d", c.ID),
		Code:            c.Code,
		Name:            c.Name,
		BackingCurrency: c.BackingCurrency,
		CurrencyRate:    c.CurrencyRate,
		CreatedAt:       c.CreatedAt.Format(dateLayout),
		UpdatedAt:       c.UpdatedAt.Format(dateLayout),
		DeletedAt:       deletedAt,
	}
}

// dbToEntities converts the DB []Currency struct to this []Currency struct
func dbToEntities(cs []*repository.Currency) []*Currency {
	responseList := make([]*Currency, 0)
	for _, currency := range cs {
		responseList = append(responseList, dbToEntity(currency))
	}
	return responseList
}
