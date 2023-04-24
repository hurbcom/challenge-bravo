package usecase

import (
	"fmt"
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	"testing"
)

func TestExecute_QuoteNotAvailable(t *testing.T) {

	currencyCodeFrom := "USD"
	currencyNameFrom := "Dolar Americano"
	unitValueBankCurrencyFrom := float64(1)

	currencyCodeTo := "ABC"
	currencyNameTo := "Moeda ABC"
	unitValueBankCurrencyTo := float64(0.25)

	isCurrencyRepositoryCalled := false
	isCorrectCodeCurrencyRepository := false
	timesCurrencyRepositoryCalled := 0

	isGetExternalQuoteCalled := false
	timesGetExternalQuoteCalled := 0

	quoteAmountExpected := float64(40)
	quoteNameExpected := fmt.Sprintf("%s/%s", currencyNameFrom, currencyNameTo)

	currencyRepositoryMock := &gateway.CurrencyRepositoryMock{
		GetByCodeMock: func(code string) (*repository.CurrencyEntity, error) {
			isCurrencyRepositoryCalled = true
			timesCurrencyRepositoryCalled++

			if code == currencyCodeTo || code == currencyCodeFrom {
				isCorrectCodeCurrencyRepository = true
			} else {
				isCorrectCodeCurrencyRepository = false
			}

			if code == currencyCodeFrom {
				return &repository.CurrencyEntity{
					Code:                  currencyCodeFrom,
					CurrencyName:          currencyNameFrom,
					UnitValueBankCurrency: unitValueBankCurrencyFrom,
					QuoteType:             repository.QuoteNotAvailable,
					Deletable:             false,
				}, nil
			}

			return &repository.CurrencyEntity{
				Code:                  currencyCodeTo,
				CurrencyName:          currencyNameTo,
				UnitValueBankCurrency: unitValueBankCurrencyTo,
				QuoteType:             repository.QuoteNotAvailable,
				Deletable:             false,
			}, nil
		},
	}

	getExternalQuoteMock := &GetExternalQuoteMock{
		ExecuteMock: func(dto *GetExternalQuoteDto) (*domain.Quote, error) {
			isGetExternalQuoteCalled = true
			timesGetExternalQuoteCalled++
			return nil, nil
		},
	}

	getQuote := NewGetQuote(currencyRepositoryMock, getExternalQuoteMock)
	quote, err := getQuote.Execute(&GetQuoteDto{
		From:   currencyCodeFrom,
		To:     currencyCodeTo,
		Amount: 10,
	})

	if err != nil {
		t.Fatalf("Erro ao executar o teste: %s", err.Error())
	}

	if !isCurrencyRepositoryCalled {
		t.Fatalf("O método %s esperado não foi chamado", "CurrencyRepository.GetByCode")
	}

	if !isCorrectCodeCurrencyRepository {
		t.Fatalf("Algum parâmetro método %s não foi informado corretamente", "CurrencyRepository.GetByCode")
	}

	if timesCurrencyRepositoryCalled != 2 {
		t.Fatalf("O método %s não foi executado %d vezes, diferente do esperdo", "CurrencyRepository.GetByCode", timesCurrencyRepositoryCalled)
	}

	if isGetExternalQuoteCalled {
		t.Fatalf("O método %s não esperado foi chamado %d vezes", "GetExternalQuote.Execute", timesGetExternalQuoteCalled)
	}

	if quote.Name != quoteNameExpected || quote.Amount != quoteAmountExpected {
		t.Fatalf("Resultado diferente do esperado")
	}
}
