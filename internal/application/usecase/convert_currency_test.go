package usecase

import (
	"errors"
	"testing"

	"github.com/ElladanTasartir/challenge-bravo/internal/application/mock"
	"github.com/ElladanTasartir/challenge-bravo/internal/application/strategy"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	domainErrors "github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
)

func makeConvertCurrencyDeps() (*mock.CurrencyRepositoryMock, entity.CurrencyStrategy, entity.CurrencyStrategy, []string) {
	repository, cacheRepository, requestCurrency, officialCurrencies := mock.NewCurrencyRepositoryMock(), mock.NewCurrencyCacheRepositoryMock(), mock.NewRequestCurrencyMock(), []string{"EUR", "USD"}

	return repository, strategy.NewCustomCurrencyStrategy(repository, cacheRepository), strategy.NewOfficialCurrencyStrategy(requestCurrency, cacheRepository), officialCurrencies
}

func TestConvertCurrency(t *testing.T) {
	repository, customStrategy, officialStrategy, officialCurrencies := makeConvertCurrencyDeps()

	convertCurrencyUseCase := NewConvertCurrencyUseCase(customStrategy, officialStrategy, officialCurrencies)

	fromCurrency, err := repository.CreateCurrency(&entity.Currency{
		Name: "Fake",
		Rate: 10,
	})
	if err != nil {
		t.Errorf("Failed to create currency with name '%s'", "USD")
	}

	toCurrency, err := repository.CreateCurrency(&entity.Currency{
		Name: "USD",
		Rate: 1,
	})
	if err != nil {
		t.Errorf("Failed to create currency with name '%s'", "USD")
	}

	const CONVERT_AMOUNT = 5

	want := convertCurrencyUseCase.ConvertAmount(CONVERT_AMOUNT, fromCurrency, toCurrency)

	response, err := convertCurrencyUseCase.ConvertCurrency(fromCurrency.Name, toCurrency.Name, CONVERT_AMOUNT)
	if err != nil {
		t.Errorf("Expected to convert amount successfully")
		return
	}

	if response.Value != want {
		t.Errorf("Expected to receive value '%f' but got '%f'", want, response.Value)
	}
}

func TestConvertCurrencyFromFails(t *testing.T) {
	repository, customStrategy, officialStrategy, officialCurrencies := makeConvertCurrencyDeps()

	convertCurrencyUseCase := NewConvertCurrencyUseCase(customStrategy, officialStrategy, officialCurrencies)

	toCurrency, err := repository.CreateCurrency(&entity.Currency{
		Name: "USD",
		Rate: 1,
	})
	if err != nil {
		t.Errorf("Failed to create currency with name '%s'", "USD")
	}

	const CONVERT_AMOUNT = 5

	var currencyNotFound *domainErrors.CurrencyNotFound

	response, err := convertCurrencyUseCase.ConvertCurrency("FAKE", toCurrency.Name, CONVERT_AMOUNT)
	if err != nil {
		if !errors.As(err, &currencyNotFound) {
			currencyNotFound = &domainErrors.CurrencyNotFound{
				Name: "FAKE",
			}

			t.Errorf("Expected error with message '%s' got '%s'", currencyNotFound.Error(), err.Error())
		}

		if errors.As(err, &currencyNotFound) && currencyNotFound.Name != "FAKE" {
			t.Errorf("Expected to find toCurrency with name '%s'", toCurrency.Name)
		}
	}

	if response != nil {
		t.Errorf("Expected to receive nil as response")
	}
}

func TestConvertCurrencyToFails(t *testing.T) {
	repository, customStrategy, officialStrategy, officialCurrencies := makeConvertCurrencyDeps()

	convertCurrencyUseCase := NewConvertCurrencyUseCase(customStrategy, officialStrategy, officialCurrencies)

	fromCurrency, err := repository.CreateCurrency(&entity.Currency{
		Name: "USD",
		Rate: 1,
	})
	if err != nil {
		t.Errorf("Failed to create currency with name '%s'", "USD")
	}

	const CONVERT_AMOUNT = 5

	var currencyNotFound *domainErrors.CurrencyNotFound

	response, err := convertCurrencyUseCase.ConvertCurrency(fromCurrency.Name, "FAKE", CONVERT_AMOUNT)
	if err != nil {
		if !errors.As(err, &currencyNotFound) {
			currencyNotFound = &domainErrors.CurrencyNotFound{
				Name: "FAKE",
			}

			t.Errorf("Expected error with message '%s' got '%s'", currencyNotFound.Error(), err.Error())
		}

		if errors.As(err, &currencyNotFound) && currencyNotFound.Name != "FAKE" {
			t.Errorf("Expected to find toCurrency with name '%s'", fromCurrency.Name)
		}
	}

	if response != nil {
		t.Errorf("Expected to receive nil as response")
	}
}
