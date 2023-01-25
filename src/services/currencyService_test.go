package services

import (
	"challenge-bravo/src/models"
	"fmt"
	"testing"
)

type RepositoryMock struct{}

func (repo *RepositoryMock) FindAll() ([]models.Currency, error) {
	return []models.Currency{}, nil
}
func (repo *RepositoryMock) FindOne(code string) (models.Currency, error) {
	if code == "USD" {
		return models.Currency{
			Code: code,
			Bid:  1,
		}, nil
	}
	if code == "BRL" {
		return models.Currency{
			Code: code,
			Bid:  0.2,
		}, nil
	}
	return models.Currency{}, fmt.Errorf("Code not exists")
}
func (repo *RepositoryMock) Create(currency models.Currency) error {
	if currency.Code == "CAD" {
		return fmt.Errorf("Currency not created!")
	}
	return nil
}
func (repo *RepositoryMock) Delete(code string) (int64, error) {
	if code != "WGN" {
		return 0, fmt.Errorf("Currncy Not Found!")
	}
	return 1, nil
}
func (repo *RepositoryMock) CreateCurrenciesFromApi(currencies []models.Currency) error {
	return nil
}

func TestCurrencyServiceCreate(t *testing.T) {
	currenciesSucces := []models.Currency{
		{
			Code: "RAF",
			Bid:  1,
		}, {
			Code: "camis",
			Bid:  26,
		},
	}

	curernciesErrors := []models.Currency{
		{
			Code: "USD",
			Bid:  1,
		},
		{
			Code: "ADL",
			Bid:  0,
		},
		{
			Code: "   ",
			Bid:  1.5,
		},
		{
			Code: "CAD",
			Bid:  0.89,
		},
	}

	repositoryMock := RepositoryMock{}

	newService := NewCurrencyService(&repositoryMock)

	for _, currMockSuccess := range currenciesSucces {
		if err := newService.Create(currMockSuccess); err != nil {
			t.Error(err)
		}
	}
	for _, currMockError := range curernciesErrors {
		if err := newService.Create(currMockError); err == nil {
			t.Error(err)
		}
	}
}

func TestCurrencyServiceFind(t *testing.T) {
	CurrencySuccess := models.Currency{
		Code: "USD",
		Bid:  1,
	}
	repositoryMock := RepositoryMock{}

	newService := NewCurrencyService(&repositoryMock)

	resultSuccess, err := newService.Find("USD")
	if err != nil {
		t.Error(err)
	}

	if resultSuccess.Code != CurrencySuccess.Code {
		t.Error(fmt.Errorf("Codigo esperado era '%s' e o recebido foi '%s' \n", CurrencySuccess.Code, resultSuccess.Code))
	}
	if resultSuccess.Bid != CurrencySuccess.Bid {
		t.Error(fmt.Errorf("Bid esperado era '%.2f' e o recebido foi '%.2f' \n", CurrencySuccess.Bid, resultSuccess.Bid))
	}

	_, err = newService.Find("RAF")
	if err == nil {
		t.Error(err)
	}
}

func TestCurrencyServiceDelete(t *testing.T) {
	codeSuccess := "WGN"
	codeError := "ADL"
	repositoryMock := RepositoryMock{}

	newService := NewCurrencyService(&repositoryMock)

	result, err := newService.Delete(codeSuccess)
	if err != nil {
		t.Error(err)
	}

	if result != 1 {
		t.Error(fmt.Errorf("resultado esperado era '%d' e o recebido foi '%d' \n", 1, result))
	}

	_, err = newService.Delete(codeError)
	if err == nil {
		t.Error(err)
	}
}

func TestCurrencyServiceConvertCurrency(t *testing.T) {
	t.Setenv("API_CRYPTOCOMPARE", "https://min-api.cryptocompare.com/data/")
	expectResponse := models.ResponseCurrency{
		FromCurrency:    "USD",
		ToCurrency:      "BRL",
		Amount:          20,
		AmountConverted: 100,
	}

	repositoryMock := RepositoryMock{}

	newService := NewCurrencyService(&repositoryMock)

	//Primeiro testa erro ao nao encontrar a moeda, o segundo encontra mas nao consegue cria-la
	errorTest := map[string]float64{"ERR": 20, "CAD": 20, "USD": 0}

	for errCode, errValue := range errorTest {
		_, err := newService.ConvertCurrency(errCode, "BRL", errValue)
		if err == nil {
			t.Error(err)
		}
	}

	result, err := newService.ConvertCurrency("USD", "BRL", 20)
	if err != nil {
		t.Error(err)
	}

	if result.Amount != expectResponse.Amount {
		t.Errorf("O Valor esperado era: '%.2f' e o recebido foi: '%.2f'", expectResponse.Amount, result.Amount)
	}
	if result.AmountConverted != expectResponse.AmountConverted {
		t.Errorf("O Valor esperado era: '%.2f' e o recebido foi: '%.2f'", expectResponse.AmountConverted, result.AmountConverted)
	}
	if result.FromCurrency != expectResponse.FromCurrency {
		t.Errorf("O Valor esperado era: '%s' e o recebido foi: '%s'", expectResponse.FromCurrency, result.FromCurrency)
	}
	if result.ToCurrency != expectResponse.ToCurrency {
		t.Errorf("O Valor esperado era: '%s' e o recebido foi: '%s'", expectResponse.ToCurrency, result.ToCurrency)
	}
}
