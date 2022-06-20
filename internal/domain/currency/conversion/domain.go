package conversion

import (
	"context"
	"fmt"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"sync"
)

// Domain struct for domain wich contains the rules to convert currencies
type Domain struct {
	repository *repository.Engine
	Models     *models.Conversion
}

// NewDomain creates a new domain
func NewDomain(repository *repository.Engine) *Domain {
	return &Domain{
		repository: repository,
		Models:     models.NewConversion()}
}

// Converter get the latest value of the currencies
func (d *Domain) Converter(ctx context.Context, from, to string, amount float64) (*float64, error) {
	d.Models.From.Code = from
	d.Models.To.Code = to
	err := d.GetRefreshedValues(ctx)
	if err != nil {
		return nil, err
	}
	var total = d.Calculate(amount)
	return &total, nil
}

//GetRefreshedValues gets the refreshed values from currencies
func (d *Domain) GetRefreshedValues(ctx context.Context) error {
	var errors = make([]error, 0)
	var wg = new(sync.WaitGroup)
	wg.Add(1)
	go func() {
		fromValue, err := d.GetRefreshValue(ctx, d.Models.From.Code)
		if err != nil {
			errors = append(errors, err)
			wg.Done()
			return
		}
		d.Models.From.Price = fromValue
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		toValue, err := d.GetRefreshValue(ctx, d.Models.To.Code)
		if err != nil {
			errors = append(errors, err)
			wg.Done()
			return
		}
		d.Models.To.Price = toValue
		wg.Done()
	}()
	wg.Wait()
	if len(errors) > 0 {
		return fmt.Errorf("%v", errors)
	}
	return nil
}

// GetRefreshValue gets the refreshed value from currency
func (d *Domain) GetRefreshValue(ctx context.Context, code string) (*float64, error) {
	var result, err = d.repository.GetPrice(ctx, code)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// Calculate calculates the total value from the amount
func (d *Domain) Calculate(amount float64) float64 {
	return (*d.Models.From.Price * amount) / *d.Models.To.Price
}
