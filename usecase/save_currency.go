package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
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
		currencyRepository       repository.CurrencyRepository
		validateNewCurrency      ValidateNewCurrency
		getQuoteType             GetQuoteType
		getQuoteToBankCurrency   GetQuoteToBankCurrency
		getQuoteFromBankCurrency GetQuoteFromBankCurrency
	}
)

func NewSaveCurrency(currencyRepository repository.CurrencyRepository, validateNewCurrency ValidateNewCurrency, getQuoteType GetQuoteType, getQuoteToBankCurrency GetQuoteToBankCurrency, getQuoteFromBankCurrency GetQuoteFromBankCurrency) SaveCurrency {
	return &saveCurrencyImpl{currencyRepository: currencyRepository, validateNewCurrency: validateNewCurrency, getQuoteType: getQuoteType, getQuoteToBankCurrency: getQuoteToBankCurrency, getQuoteFromBankCurrency: getQuoteFromBankCurrency}
}

func (s saveCurrencyImpl) Execute(dto *SaveCurrencyDto) (*domain.Currency, error) {
	quoteType, err := s.getQuoteType.Execute(&GetQuoteTypeDto{Code: dto.Code})
	if err != nil {
		return nil, err
	}

	err = s.validateNewCurrency.Execute(&ValidateNewCurrencyDto{
		CurrencyCode:          dto.Code,
		quoteType:             quoteType,
		UnitValueBankCurrency: dto.UnitValueBankCurrency,
		CurrencyName:          dto.CurrencyName,
	})

	if err != nil {
		return nil, err
	}

	regex := regexp.MustCompile(`/`)
	var quote *domain.Quote
	var currencyEntity *repository.CurrencyEntity
	var amount float64

	switch quoteType {
	case domain.QuoteToBankCurrency:
		quote, err = s.getQuoteToBankCurrency.Execute(&GetQuoteToBankCurrencyDto{CurrencyCode: dto.Code})

		if err != nil {
			return nil, err
		}

		amount = quote.Amount
		currencyEntity = &repository.CurrencyEntity{
			Code:         dto.Code,
			CurrencyName: regex.Split(quote.Name, -1)[0],
			QuoteType:    repository.QuoteToBankCurrency,
			Deletable:    true,
		}

	case domain.QuoteFromBankCurrency:
		quote, err = s.getQuoteFromBankCurrency.Execute(&GetQuoteFromBankCurrencyDto{CurrencyCode: dto.Code})

		if err != nil {
			return nil, err
		}

		amount = quote.Amount
		currencyEntity = &repository.CurrencyEntity{
			Code:         dto.Code,
			CurrencyName: regex.Split(quote.Name, -1)[1],
			QuoteType:    repository.QuoteFromBankCurrency,
			Deletable:    true,
		}

	default:
		amount = dto.UnitValueBankCurrency
		currencyEntity = &repository.CurrencyEntity{
			Code:                  dto.Code,
			CurrencyName:          dto.CurrencyName,
			UnitValueBankCurrency: dto.UnitValueBankCurrency,
			QuoteType:             repository.QuoteNotAvailable,
			Deletable:             true,
		}
	}

	currencyEntity, err = s.currencyRepository.Save(currencyEntity)

	if err != nil {
		return nil, err
	}

	return &domain.Currency{
		Code:                  currencyEntity.Code,
		CurrencyName:          currencyEntity.CurrencyName,
		UnitValueBankCurrency: amount,
	}, nil
}
