package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
)

type (
	GetQuoteToBankCurrencyDto struct {
		CurrencyCode string
	}
	GetQuoteToBankCurrency interface {
		Execute(dto *GetQuoteToBankCurrencyDto) (*domain.Quote, error)
	}

	getQuoteToBankCurrencyImpl struct {
		getExternalQuote GetExternalQuote
	}
)

func NewGetQuoteToBankCurrency(getExternalQuote GetExternalQuote) GetQuoteToBankCurrency {
	return &getQuoteToBankCurrencyImpl{getExternalQuote: getExternalQuote}
}

func (g getQuoteToBankCurrencyImpl) Execute(dto *GetQuoteToBankCurrencyDto) (*domain.Quote, error) {
	return g.getExternalQuote.Execute(&GetExternalQuoteDto{
		CurrencyCode: dto.CurrencyCode,
		QuoteType:    domain.QuoteToBankCurrency,
	})
}
