package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
)

type (
	GetQuoteFromBankCurrencyDto struct {
		CurrencyCode string
	}
	GetQuoteFromBankCurrency interface {
		Execute(dto *GetQuoteFromBankCurrencyDto) (*domain.Quote, error)
	}

	getQuoteFromBankCurrencyImpl struct {
		getExternalQuote GetExternalQuote
	}
)

func NewGetQuoteFromBankCurrency(getExternalQuote GetExternalQuote) GetQuoteFromBankCurrency {
	return &getQuoteFromBankCurrencyImpl{getExternalQuote: getExternalQuote}
}

func (g getQuoteFromBankCurrencyImpl) Execute(dto *GetQuoteFromBankCurrencyDto) (*domain.Quote, error) {
	return g.getExternalQuote.Execute(&GetExternalQuoteDto{
		CurrencyCode: dto.CurrencyCode,
		QuoteType:    domain.QuoteFromBankCurrency,
	})
}
