package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"regexp"
)

type (
	SaveCurrencyDto struct {
		Code                  string
		CurrencyName          string
		UnitValueBankCurrency float64
	}
	SaveCurrency interface {
		Execute(dto *SaveCurrencyDto) (*domain.Currency, error)
	}

	saveCurrencyImpl struct {
		environment              env.Environment
		currencyRepository       repository.CurrencyRepository
		validateNewCurrency      ValidateNewCurrency
		getQuoteType             GetQuoteType
		getQuoteToBankCurrency   GetQuoteToBankCurrency
		getQuoteFromBankCurrency GetQuoteFromBankCurrency
	}
)

func (s saveCurrencyImpl) Execute(dto *SaveCurrencyDto) (*domain.Currency, error) {
	quoteType, err := s.getQuoteType.Execute(&GetQuoteTypeDto{Code: dto.Code})
	if err != nil {
		return nil, err
	}

	err = s.validateNewCurrency.Execute(&ValidateNewCurrencyDto{
		CurrencyCode: dto.Code,
		quoteType:    quoteType,
	})

	if err != nil {
		return nil, err
	}

	regex := regexp.MustCompile(`/`)
	var quote *domain.Quote
	var currencyEntity *repository.CurrencyEntity

	switch quoteType {
	case domain.QuoteToBankCurrency:
		quote, err = s.getQuoteToBankCurrency.Execute(&GetQuoteToBankCurrencyDto{CurrencyCode: dto.Code})

		if err != nil {
			return nil, err
		}

		currencyEntity, err = s.currencyRepository.Save(&repository.CurrencyEntity{
			Code:                  dto.Code,
			CurrencyName:          regex.Split(quote.Name, -1)[0],
			UnitValueBankCurrency: quote.Amount,
			QuoteType:             repository.QuoteToBankCurrency,
		})

	case domain.QuoteFromBankCurrency:
		quote, err = s.getQuoteFromBankCurrency.Execute(&GetQuoteFromBankCurrencyDto{CurrencyCode: dto.Code})

		if err != nil {
			return nil, err
		}

		currencyEntity, err = s.currencyRepository.Save(&repository.CurrencyEntity{
			Code:                  dto.Code,
			CurrencyName:          regex.Split(quote.Name, -1)[1],
			UnitValueBankCurrency: quote.Amount,
			QuoteType:             repository.QuoteFromBankCurrency,
		})

	default:
		currencyEntity, err = s.currencyRepository.Save(&repository.CurrencyEntity{
			Code:                  dto.Code,
			CurrencyName:          dto.CurrencyName,
			UnitValueBankCurrency: dto.UnitValueBankCurrency,
			QuoteType:             repository.QuoteNotAvailable,
		})
	}

	if err != nil {
		return nil, err
	}

	return &domain.Currency{
		Code:                  currencyEntity.Code,
		CurrencyName:          currencyEntity.CurrencyName,
		UnitValueBankCurrency: currencyEntity.UnitValueBankCurrency,
	}, nil
}
