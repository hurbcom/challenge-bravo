package usecase

import (
	"errors"
	"testing"

	"github.com/ElladanTasartir/challenge-bravo/internal/application/mock"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	domainErrors "github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
)

func makeCreateCurrencyDeps() (*mock.CurrencyRepositoryMock, *mock.CurrencyCacheRepositoryMock, []string) {
	return mock.NewCurrencyRepositoryMock(), mock.NewCurrencyCacheRepositoryMock(), []string{"EUR", "USD"}
}

func TestCreateCurrency(t *testing.T) {
	currencyRepository, currencyCacheRepository, officialCurrencies := makeCreateCurrencyDeps()

	createCurrencyUseCase := NewCreateCurrencyUseCase(currencyRepository, currencyCacheRepository, officialCurrencies)

	payload := &CurrencyPayload{
		Name: "Fake",
		Rate: 10,
	}

	_, err := createCurrencyUseCase.CreateCurrency(payload)
	if err != nil {
		t.Errorf("Expected currency to be created")
	}
}

func TestCreateOfficialCurrency(t *testing.T) {
	currencyRepository, currencyCacheRepository, officialCurrencies := makeCreateCurrencyDeps()

	createCurrencyUseCase := NewCreateCurrencyUseCase(currencyRepository, currencyCacheRepository, officialCurrencies)

	payload := &CurrencyPayload{
		Name: "EUR",
		Rate: 5,
	}

	var currencyExistsError *domainErrors.CurrencyAlreadyExists
	got, err := createCurrencyUseCase.CreateCurrency(payload)
	if err != nil && !errors.As(err, &currencyExistsError) {
		currencyExistsError := domainErrors.CurrencyAlreadyExists{
			Name: payload.Name,
		}

		t.Errorf("Expected error with message '%s' got '%s'", currencyExistsError.Error(), err.Error())
	}

	if got != nil {
		t.Errorf("Expected nil but got value")
	}
}

func TestCurrencyExistsInCache(t *testing.T) {
	currencyRepository, currencyCacheRepository, officialCurrencies := makeCreateCurrencyDeps()

	createCurrencyUseCase := NewCreateCurrencyUseCase(currencyRepository, currencyCacheRepository, officialCurrencies)

	currency := &entity.Currency{
		Name: "CACHED",
		Rate: 5,
	}

	ok := currencyCacheRepository.CreateCurrency(currency)
	if !ok {
		t.Errorf("Expected cache curency to be created")
	}

	payload := &CurrencyPayload{
		Name: "CACHED",
		Rate: 5,
	}

	var currencyExistsError *domainErrors.CurrencyAlreadyExists

	got, err := createCurrencyUseCase.CreateCurrency(payload)
	if err != nil && !errors.As(err, &currencyExistsError) {
		currencyExistsError := domainErrors.CurrencyAlreadyExists{
			Name: payload.Name,
		}

		t.Errorf("Expected error with message '%s' got '%s'", currencyExistsError.Error(), err.Error())
	}

	if got != nil {
		t.Errorf("Expected nil but got value")
	}
}

func TestCreateCurrencyExistsInStorage(t *testing.T) {
	currencyRepository, currencyCacheRepository, officialCurrencies := makeCreateCurrencyDeps()

	createCurrencyUseCase := NewCreateCurrencyUseCase(currencyRepository, currencyCacheRepository, officialCurrencies)

	currency := &entity.Currency{
		Name: "STORAGE",
		Rate: 5,
	}

	_, err := currencyRepository.CreateCurrency(currency)
	if err != nil {
		t.Errorf("Expected storage curency to be created")
	}

	payload := &CurrencyPayload{
		Name: "STORAGE",
		Rate: 5,
	}

	var currencyExistsError *domainErrors.CurrencyAlreadyExists
	got, err := createCurrencyUseCase.CreateCurrency(payload)
	if err != nil && !errors.As(err, &currencyExistsError) {
		currencyExistsError := domainErrors.CurrencyAlreadyExists{
			Name: payload.Name,
		}

		t.Errorf("Expected error with message '%s' got '%s'", currencyExistsError.Error(), err.Error())
	}

	if got != nil {
		t.Errorf("Expected nil but got value")
	}
}
