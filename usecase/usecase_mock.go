package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
)

type (
	GetQuoteFromBankCurrencyMock struct {
		ExecuteMock func(dto *GetQuoteFromBankCurrencyDto) (*domain.Quote, error)
	}

	GetQuoteToBankCurrencyMock struct {
		ExecuteMock func(dto *GetQuoteToBankCurrencyDto) (*domain.Quote, error)
	}

	GetQuoteTypeMock struct {
		ExecuteMock func(dto *GetQuoteTypeDto) (domain.QuoteType, error)
	}

	ValidateNewCurrencyMock struct {
		ExecuteMock func(dto *ValidateNewCurrencyDto) error
	}

	GetExternalQuoteMock struct {
		ExecuteMock func(dto *GetExternalQuoteDto) (*domain.Quote, error)
	}
)

func (g *GetQuoteFromBankCurrencyMock) Execute(dto *GetQuoteFromBankCurrencyDto) (*domain.Quote, error) {
	return g.ExecuteMock(dto)
}

func (g *GetQuoteToBankCurrencyMock) Execute(dto *GetQuoteToBankCurrencyDto) (*domain.Quote, error) {
	return g.ExecuteMock(dto)
}

func (g *GetQuoteTypeMock) Execute(dto *GetQuoteTypeDto) (domain.QuoteType, error) {
	return g.ExecuteMock(dto)
}

func (v *ValidateNewCurrencyMock) Execute(dto *ValidateNewCurrencyDto) error {
	return v.ExecuteMock(dto)
}

func (g *GetExternalQuoteMock) Execute(dto *GetExternalQuoteDto) (*domain.Quote, error) {
	return g.ExecuteMock(dto)
}
