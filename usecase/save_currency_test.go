package usecase

import (
	"fmt"
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	"testing"
)

func TestExecute_QuoteToBankCurrency(t *testing.T) {

	code := "ABC"
	currencyName := "Moeda ABC"
	unitValueBankCurrency := 0.25
	quoteToBankCurrency := domain.QuoteToBankCurrency

	isGetQuoteTypeCalled := false
	isCorrectQuoteType := false
	isCorrectCodeGetQuoteType := false

	isValidateNewCurrencyCalled := false
	isCorrectCodeValidateNewCurrency := false
	isCorrectCurrencyNameValidateNewCurrency := false
	isCorrectUnitValueBankCurrencyValidateNewCurrency := false

	isGetQuoteToBankCurrencyCalled := false
	isCorrectCodeGetQuoteToBankCurrency := false

	isGetQuoteFromBankCurrencyCalled := false

	isCurrencyRepositoryCalled := false
	isCorrectCodeCurrencyRepository := false
	isCorrectCurrencyNameCurrencyRepository := false
	isCorrectUnitValueBankCurrencyCurrencyRepository := false
	isCorrectQuoteTypeCurrencyRepository := false
	isCorrectDeletableCurrencyRepository := false

	getQuoteTypeMock := &GetQuoteTypeMock{
		ExecuteMock: func(dto *GetQuoteTypeDto) (domain.QuoteType, error) {
			isGetQuoteTypeCalled = true
			isCorrectCodeGetQuoteType = dto.Code == code
			return quoteToBankCurrency, nil
		},
	}

	validateNewCurrencyMock := &ValidateNewCurrencyMock{
		ExecuteMock: func(dto *ValidateNewCurrencyDto) error {
			isValidateNewCurrencyCalled = true
			isCorrectQuoteType = quoteToBankCurrency == dto.quoteType
			isCorrectCodeValidateNewCurrency = dto.CurrencyCode == code
			isCorrectCurrencyNameValidateNewCurrency = dto.CurrencyName == currencyName
			isCorrectUnitValueBankCurrencyValidateNewCurrency = dto.UnitValueBankCurrency == unitValueBankCurrency
			return nil
		},
	}

	getQuoteToBankCurrencyMock := &GetQuoteToBankCurrencyMock{
		ExecuteMock: func(dto *GetQuoteToBankCurrencyDto) (*domain.Quote, error) {
			isGetQuoteToBankCurrencyCalled = true
			isCorrectCodeGetQuoteToBankCurrency = dto.CurrencyCode == code
			return &domain.Quote{
				From:   currencyName,
				To:     "USD",
				Name:   fmt.Sprint(currencyName, "/USD"),
				Amount: unitValueBankCurrency,
			}, nil
		},
	}

	getQuoteFromBankCurrencyMock := &GetQuoteFromBankCurrencyMock{
		ExecuteMock: func(dto *GetQuoteFromBankCurrencyDto) (*domain.Quote, error) {
			isGetQuoteFromBankCurrencyCalled = true
			return nil, nil
		},
	}

	currencyRepositoryMock := &gateway.CurrencyRepositoryMock{
		SaveMock: func(entity *repository.CurrencyEntity) (*repository.CurrencyEntity, error) {
			isCurrencyRepositoryCalled = true
			isCorrectCodeCurrencyRepository = entity.Code == code
			isCorrectCurrencyNameCurrencyRepository = entity.CurrencyName == currencyName
			isCorrectUnitValueBankCurrencyCurrencyRepository = entity.UnitValueBankCurrency == 0
			isCorrectQuoteTypeCurrencyRepository = entity.QuoteType == repository.QuoteToBankCurrency
			isCorrectDeletableCurrencyRepository = entity.Deletable

			return entity, nil
		},
	}

	saveCurrency := NewSaveCurrency(currencyRepositoryMock, validateNewCurrencyMock, getQuoteTypeMock, getQuoteToBankCurrencyMock, getQuoteFromBankCurrencyMock)
	currency, err := saveCurrency.Execute(&SaveCurrencyDto{
		Code:                  code,
		CurrencyName:          currencyName,
		UnitValueBankCurrency: unitValueBankCurrency,
	})

	if err != nil {
		t.Fatalf("Erro ao executar o teste: %s", err.Error())
	}

	if !isGetQuoteTypeCalled {
		t.Fatalf("O método %s esperado não foi chamado", "GetQuoteType.Execute")
	}

	if !isCorrectQuoteType || !isCorrectCodeGetQuoteType {
		t.Fatalf("Algum atributo do parâmetro método %s não foi informado corretamente", "GetQuoteType.Execute")
	}

	if !isValidateNewCurrencyCalled {
		t.Fatalf("O método %s esperado não foi chamado", "ValidateNewCurrency.Execute")
	}

	if !isCorrectCodeValidateNewCurrency || !isCorrectCurrencyNameValidateNewCurrency || !isCorrectUnitValueBankCurrencyValidateNewCurrency {
		t.Fatalf("Algum atributo do parâmetro método %s não foi informado corretamente", "ValidateNewCurrency.Execute")
	}

	if !isGetQuoteToBankCurrencyCalled {
		t.Fatalf("O método %s esperado não foi chamado", "GetQuoteToBankCurrency.Execute")
	}

	if !isCorrectCodeGetQuoteToBankCurrency {
		t.Fatalf("Algum atributo do parâmetro método %s não foi informado corretamente", "GetQuoteToBankCurrency.Execute")
	}

	if isGetQuoteFromBankCurrencyCalled {
		t.Fatalf("O método %s não esperado foi chamado", "GetQuoteFromBankCurrency.Execute")
	}

	if !isCurrencyRepositoryCalled {
		t.Fatalf("O método %s esperado não foi chamado", "CurrencyRepository.Save")
	}

	if !isCorrectCodeCurrencyRepository || !isCorrectCurrencyNameCurrencyRepository || !isCorrectUnitValueBankCurrencyCurrencyRepository || !isCorrectQuoteTypeCurrencyRepository || !isCorrectDeletableCurrencyRepository {
		t.Fatalf("Algum atributo do parâmetro método %s não foi informado corretamente", "CurrencyRepository.Save")
	}

	if currency.Code != code || currency.CurrencyName != currencyName || currency.UnitValueBankCurrency != unitValueBankCurrency {
		t.Fatalf("O retorno do método está incorreto")
	}

}
