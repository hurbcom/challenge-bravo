package action

import (
	"context"
	externalDomain "github.com/joaohgf/challenge-bravo/external/domain"
	externalModels "github.com/joaohgf/challenge-bravo/external/repository/models"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"strconv"
	"sync"
	"time"
)

// Update is the action to update the currency
type Update struct {
	repository *repository.Engine
	errors     *Errors
}

// NewUpdate creates a new action to create/update the currency
func NewUpdate(repo *repository.Engine) *Update {
	return &Update{
		repository: repo,
		errors:     NewErrors(repo),
	}
}

// Act updates with the currency with the latest price
func (u *Update) Act(ctx context.Context) {

	// get all currencies prices from external api
	var externalCurrency = externalDomain.NewCurrency()
	var currencies, err = externalCurrency.GetAllCurrency()
	if err != nil {
		u.errors.err["external_api"] = err
	}
	var wg = new(sync.WaitGroup)
	for _, cr := range currencies {
		wg.Add(1)
		go func(c *externalModels.CurrencyPrice) {
			// validate the data get from external api
			validateErr := c.Validate()
			if len(validateErr) > 0 {
				u.errors.err["validate"] = validateErr
				wg.Done()
				return
			}
			// parse the time to be used by the repository
			updatedParsed, err := time.Parse(time.RFC3339, c.UpdatedAt)
			if err != nil {
				u.errors.err["parse_time"] = err
				wg.Done()
				return
			}
			// parse the price to be used by the repository
			price, err := strconv.ParseFloat(c.Price, 64)
			if err != nil {
				u.errors.err["parse_price"] = err
				wg.Done()
				return
			}
			// create the currency to be used by the repository
			var currency = models.NewCurrency(c.Name, c.Code, &price, &updatedParsed)
			// create or update the currency to be used by the repository
			_, err = u.repository.Update(ctx, c.Code, currency)
			if err != nil {
				u.errors.err["repository"] = err
				wg.Done()
				return
			}
			wg.Done()
			return
		}(cr)
	}
	wg.Wait()
	if len(u.errors.err) > 0 {
		u.errors.Save(ctx)
	}
}
