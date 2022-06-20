package currency

import (
	"github.com/joaohgf/challenge-bravo/internal/domain/currency"
	"github.com/joaohgf/challenge-bravo/internal/repository"
)

type Handler struct {
	domain *currency.Domain
}

// NewHandler creates a new handler with domain
func NewHandler(repository *repository.Engine) *Handler {
	return &Handler{domain: currency.NewDomain(repository)}
}
