package usecase

import (
	"errors"
	"testing"

	"github.com/ElladanTasartir/challenge-bravo/internal/application/mock"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	domainErrors "github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
)

func makeDeleteCurrencyDeps() (*mock.CurrencyRepositoryMock, *mock.CurrencyCacheRepositoryMock, []string) {
	return mock.NewCurrencyRepositoryMock(), mock.NewCurrencyCacheRepositoryMock(), []string{"EUR", "USD"}
}

func TestDeleteCurrency(t *testing.T) {
	repository, cacheRepository, officialCurrencies := makeDeleteCurrencyDeps()

	deleteCurrencyUseCase := NewDeleteCurrencyUseCase(repository, cacheRepository, officialCurrencies)

	currency := &entity.Currency{
		Name: "FAKE",
		Rate: 5,
	}

	_, err := repository.CreateCurrency(currency)
	if err != nil {
		t.Errorf("Expected storage curency to be created")
	}

	err = deleteCurrencyUseCase.DeleteCurrency(currency.Name)
	if err != nil {
		t.Errorf("Expected currency to be deleted")
	}
}

func TestDeleteOfficialCurrency(t *testing.T) {
	repository, cacheRepository, officialCurrencies := makeDeleteCurrencyDeps()

	deleteCurrencyUseCase := NewDeleteCurrencyUseCase(repository, cacheRepository, officialCurrencies)

	var currencyExistsError *domainErrors.CurrencyAlreadyExists

	err := deleteCurrencyUseCase.DeleteCurrency("EUR")
	if err != nil && !errors.As(err, &currencyExistsError) {
		currencyExistsError := domainErrors.CurrencyAlreadyExists{
			Name: "EUR",
		}

		t.Errorf("Expected error with message '%s' got '%s'", currencyExistsError.Error(), err.Error())
	}

	if err == nil {
		t.Errorf("Expected error to not be nil")
	}
}

func TestDeleteCurrencyExistsInCache(t *testing.T) {
	repository, cacheRepository, officialCurrencies := makeDeleteCurrencyDeps()

	deleteCurrencyUseCase := NewDeleteCurrencyUseCase(repository, cacheRepository, officialCurrencies)
	createCurrencyUseCase := NewCreateCurrencyUseCase(repository, cacheRepository, officialCurrencies)

	payload := &CurrencyPayload{
		Name: "CACHE",
		Rate: 5,
	}

	_, err := createCurrencyUseCase.CreateCurrency(payload)
	if err != nil {
		t.Errorf("Expected storage curency to be created")
	}

	err = deleteCurrencyUseCase.DeleteCurrency(payload.Name)
	if err != nil {
		t.Errorf("Expected currency to be deleted")
	}
}

func TestDeleteCurrencyDoesNotExistInStorage(t *testing.T) {
	repository, cacheRepository, officialCurrencies := makeDeleteCurrencyDeps()

	deleteCurrencyUseCase := NewDeleteCurrencyUseCase(repository, cacheRepository, officialCurrencies)

	var currencyNotFound *domainErrors.CurrencyNotFound

	err := deleteCurrencyUseCase.DeleteCurrency("STORAGE")
	if err != nil && !errors.As(err, &currencyNotFound) {
		currencyNotFound := domainErrors.CurrencyNotFound{
			Name: "STORAGE",
		}

		t.Errorf("Expected error with message '%s' got '%s'", currencyNotFound.Error(), err.Error())
	}

	if err == nil {
		t.Errorf("Expected error to not be nil")
	}
}
