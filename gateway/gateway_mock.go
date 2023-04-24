package gateway

import (
	"github.com/VictorNapoles/challenge-bravo/gateway/awesomeapi"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
)

type (
	CurrencyRepositoryMock struct {
		GetByCodeMock func(code string) (*repository.CurrencyEntity, error)
		SaveMock      func(entity *repository.CurrencyEntity) (*repository.CurrencyEntity, error)
		DeleteMock    func(code string) (int64, error)
	}

	QuoteRepositoryMock struct {
		CheckIsAvailableQuoteMock func(from, to string) (bool, error)
		SaveQuoteMock             func(entity *repository.QuoteEntity) error
		GetQuoteMock              func(from, to string) (*repository.QuoteEntity, error)
		SetAvailableQuoteMock     func(from, to string) error
	}

	AwesomeApiClientMock struct {
		GetQuoteMock               func(from, to string) (*awesomeapi.QuoteDto, error)
		GetAvailableQuotesMock     func() (map[string]string, error)
		GetAvailableCurrenciesMock func() (map[string]string, error)
	}
)

func (c *CurrencyRepositoryMock) GetByCode(code string) (*repository.CurrencyEntity, error) {
	return c.GetByCodeMock(code)
}

func (c *CurrencyRepositoryMock) Save(entity *repository.CurrencyEntity) (*repository.CurrencyEntity, error) {
	return c.SaveMock(entity)
}

func (c *CurrencyRepositoryMock) Delete(code string) (int64, error) {
	return c.DeleteMock(code)
}

func (q *QuoteRepositoryMock) CheckIsAvailableQuote(from, to string) (bool, error) {
	return q.CheckIsAvailableQuoteMock(from, to)
}

func (q *QuoteRepositoryMock) SaveQuote(entity *repository.QuoteEntity) error {
	return q.SaveQuoteMock(entity)
}

func (q *QuoteRepositoryMock) GetQuote(from, to string) (*repository.QuoteEntity, error) {
	return q.GetQuoteMock(from, to)
}

func (q *QuoteRepositoryMock) SetAvailableQuote(from, to string) error {
	return q.SetAvailableQuoteMock(from, to)
}

func (a *AwesomeApiClientMock) GetQuote(from, to string) (*awesomeapi.QuoteDto, error) {
	return a.GetQuoteMock(from, to)
}

func (a *AwesomeApiClientMock) GetAvailableQuotes() (map[string]string, error) {
	return a.GetAvailableQuotesMock()
}

func (a *AwesomeApiClientMock) GetAvailableCurrencies() (map[string]string, error) {
	return a.GetAvailableCurrenciesMock()
}
