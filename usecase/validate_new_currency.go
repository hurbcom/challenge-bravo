package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
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

	validateNewCurrencyImpl struct {
		currencyRepository repository.CurrencyRepository
	}
)

func NewValidateNewCurrency(currencyRepository repository.CurrencyRepository) ValidateNewCurrency {
	return &validateNewCurrencyImpl{currencyRepository}
}

func (s *validateNewCurrencyImpl) Execute(dto *ValidateNewCurrencyDto) error {
	currencyEntity, err := s.currencyRepository.GetByCode(dto.CurrencyCode)
	if err != nil {
		return err
	}

	if currencyEntity.Code != "" {
		return &UsecaseError{
			Message: "Currency already registered in the database",
		}
	}
	var availableQuote = dto.quoteType == domain.QuoteToBankCurrency || dto.quoteType == domain.QuoteFromBankCurrency

	if availableQuote && dto.UnitValueBankCurrency != 0 {
		return &UsecaseError{
			Message: "It is a quotable currency. The unit value of bank currency must be null or zero",
		}
	}

	if !availableQuote && dto.UnitValueBankCurrency == 0 {
		return &UsecaseError{
			Message: "It is not a quotable currency. The unit value of bank currency can not be null or zero",
		}
	}

	if !availableQuote && dto.CurrencyCode == "" {
		return &UsecaseError{
			Message: "The currency code can not be null or empty",
		}
	}

	if !availableQuote && dto.CurrencyName == "" {
		return &UsecaseError{
			Message: "The currency name can not be null or empty",
		}
	}

	return nil
}
