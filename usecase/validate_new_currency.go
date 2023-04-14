package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
)

type (
	ValidateNewCurrencyDto struct {
		CurrencyCode          string
		CurrencyName          string
		UnitValueBankCurrency float64
		quoteType             domain.QuoteType
	}
	ValidateNewCurrency interface {
		Execute(dto *ValidateNewCurrencyDto) error
	}

	validateNewCurrencyImpl struct{}
)

func NewValidateNewCurrency() ValidateNewCurrency {
	return &validateNewCurrencyImpl{}
}

func (s *validateNewCurrencyImpl) Execute(dto *ValidateNewCurrencyDto) error {
	var availableQuote = dto.quoteType == domain.QuoteToBankCurrency || dto.quoteType == domain.QuoteFromBankCurrency

	if availableQuote && dto.UnitValueBankCurrency != 0 {
		return UsecaseError{
			Message: "It is a quotable currency. The unit value of bank currency must be null or zero",
		}
	}

	if !availableQuote && dto.UnitValueBankCurrency == 0 {
		return UsecaseError{
			Message: "It is not a quotable currency. The unit value of bank currency can not be null or zero",
		}
	}

	if dto.CurrencyCode == "" {
		return UsecaseError{
			Message: "The currency code can not be null or empty",
		}
	}

	if dto.CurrencyName == "" {
		return UsecaseError{
			Message: "The currency name can not be null or empty",
		}
	}

	return nil
}
