package currency

import (
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
)

// Domain is the domain for currency
type Domain struct {
	repository *repository.Engine
	Models     *models.Currency
}

// NewDomain creates a new domain with repository engine
func NewDomain(repository *repository.Engine) *Domain {
	return &Domain{repository: repository}
}
