package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
)

type (
	GetQuoteTypeDto struct {
		Code string
	}
	GetQuoteType interface {
		Execute(dto *GetQuoteTypeDto) (domain.QuoteType, error)
	}

	getQuoteTypeImpl struct {
		quoteRepository repository.QuoteRepository
		environment     env.Environment
	}
)

func (s *getQuoteTypeImpl) Execute(dto *GetQuoteTypeDto) (domain.QuoteType, error) {
	bankCurrencyCode, err := s.environment.Get(BANK_CURRENCY_CODE_ENV_VAR)
	if err != nil {
		return domain.QuoteNotAvailable, err
	}

	availableQuoteToBankCurrency, err := s.quoteRepository.CheckIsAvailableQuote(dto.Code, bankCurrencyCode)
	if err != nil {
		return domain.QuoteNotAvailable, err
	}

	if availableQuoteToBankCurrency {
		return domain.QuoteToBankCurrency, nil

	} else {

		availableQuoteFromBankCurrency, err := s.quoteRepository.CheckIsAvailableQuote(bankCurrencyCode, dto.Code)
		if err != nil {
			return domain.QuoteNotAvailable, err
		}

		if availableQuoteFromBankCurrency {
			return domain.QuoteFromBankCurrency, nil
		} else {
			return domain.QuoteNotAvailable, nil
		}

	}

}
