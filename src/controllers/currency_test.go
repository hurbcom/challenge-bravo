package controllers

import (
	"bytes"
	"challenge-bravo/src/models"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gorilla/mux"
)

type CurrencyServiceMock struct{}

func (service *CurrencyServiceMock) Create(currency models.Currency) error {
	if currency.Code == "ERR" {
		return fmt.Errorf("Erro on create cyurrency")
	}
	return nil
}

func (service *CurrencyServiceMock) Find(code string) (models.Currency, error) {
	if code == "USD" {
		return models.Currency{}, nil
	} else {
		return models.Currency{}, fmt.Errorf("Currency not Found")
	}
}
func (service *CurrencyServiceMock) FindAll() ([]models.Currency, error) {
	return []models.Currency{}, nil
}
func (service *CurrencyServiceMock) Delete(code string) (int64, error) {
	if code == "USD" {
		return 1, nil
	} else {
		return 0, fmt.Errorf("Error on delete currency")
	}
}
func (service *CurrencyServiceMock) ConvertCurrency(fromCurr, toCurr string, amount float64) (models.ResponseCurrency, error) {
	if fromCurr == "ERR" {
		return models.ResponseCurrency{}, fmt.Errorf("Currency not found")
	}
	return models.ResponseCurrency{}, nil
}

type errReader int

func (errReader) Read(p []byte) (n int, err error) {
	return 0, errors.New("test error")
}

func TestCurrencyControllerCreate(t *testing.T) {
	serviceMock := CurrencyServiceMock{}
	newController := NewCurrencyController(&serviceMock)

	currency := models.Currency{
		Code: "USD",
		Bid:  1,
	}

	jsonCurrency, err := json.Marshal(currency)
	if err != nil {
		log.Fatal(err)
	}

	errorCurrency := models.Currency{
		Code: "ERR",
		Bid:  0,
	}

	jsonErrorCurrency, err := json.Marshal(errorCurrency)
	if err != nil {
		log.Fatal(err)
	}

	jsonErrorCurrencyUnmarshal, err := json.Marshal(struct {
		Code    int
		Fim     string
		isValid bool
	}{
		Code:    171,
		Fim:     "False",
		isValid: false,
	})
	if err != nil {
		log.Fatal(err)
	}

	rSuccess := httptest.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonCurrency))
	rError := httptest.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonErrorCurrency))
	rErrorIO := httptest.NewRequest(http.MethodPost, "/currency", errReader(0))
	rErrorUnmarshal := httptest.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonErrorCurrencyUnmarshal))

	wSuccess := httptest.NewRecorder()
	wError := httptest.NewRecorder()
	wErrorIO := httptest.NewRecorder()
	wErrorUnmarshal := httptest.NewRecorder()

	newController.Create(wSuccess, rSuccess)
	gotSuccess := wSuccess.Result()

	if !reflect.DeepEqual(http.StatusCreated, gotSuccess.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusCreated, gotSuccess.StatusCode)
	}

	newController.Create(wError, rError)
	gotError := wError.Result()
	if !reflect.DeepEqual(http.StatusInternalServerError, gotError.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusInternalServerError, gotError.StatusCode)
	}

	newController.Create(wErrorIO, rErrorIO)
	gotErrorID := wError.Result()
	if !reflect.DeepEqual(http.StatusInternalServerError, gotErrorID.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusInternalServerError, gotErrorID.StatusCode)
	}

	newController.Create(wErrorUnmarshal, rErrorUnmarshal)
	gotErrorUnmarshal := wError.Result()
	if !reflect.DeepEqual(http.StatusInternalServerError, gotErrorUnmarshal.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusInternalServerError, gotErrorUnmarshal.StatusCode)
	}
}

func TestCurrencyControllerFind(t *testing.T) {
	serviceMock := CurrencyServiceMock{}
	newController := NewCurrencyController(&serviceMock)

	rSuccess := httptest.NewRequest(http.MethodGet, "/currency", nil)
	rError := httptest.NewRequest(http.MethodGet, "/currency", nil)
	wSuccess := httptest.NewRecorder()
	wError := httptest.NewRecorder()

	rSuccess = mux.SetURLVars(rSuccess, map[string]string{
		"code": "USD",
	})
	newController.Find(wSuccess, rSuccess)

	gotSuccess := wSuccess.Result()

	if !reflect.DeepEqual(http.StatusOK, gotSuccess.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusOK, gotSuccess.StatusCode)
	}

	rError = mux.SetURLVars(rError, map[string]string{
		"code": "BRL",
	})

	newController.Find(wError, rError)

	gotError := wError.Result()

	if !reflect.DeepEqual(http.StatusInternalServerError, gotError.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusInternalServerError, gotError.StatusCode)
	}
}
func TestCurrencyControllerDelete(t *testing.T) {
	serviceMock := CurrencyServiceMock{}
	newController := NewCurrencyController(&serviceMock)

	rSuccess := httptest.NewRequest(http.MethodDelete, "/currency", nil)
	rError := httptest.NewRequest(http.MethodDelete, "/currency", nil)
	wSuccess := httptest.NewRecorder()
	wError := httptest.NewRecorder()

	rSuccess = mux.SetURLVars(rSuccess, map[string]string{
		"code": "USD",
	})
	newController.Delete(wSuccess, rSuccess)

	gotSuccess := wSuccess.Result()

	if !reflect.DeepEqual(http.StatusAccepted, gotSuccess.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusAccepted, gotSuccess.StatusCode)
	}

	rError = mux.SetURLVars(rError, map[string]string{
		"code": "BRL",
	})

	newController.Delete(wError, rError)

	gotError := wError.Result()

	if !reflect.DeepEqual(http.StatusInternalServerError, gotError.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusInternalServerError, gotError.StatusCode)
	}
}
func TestCurrencyControllerConvert(t *testing.T) {
	serviceMock := CurrencyServiceMock{}
	newController := NewCurrencyController(&serviceMock)

	testCases := map[string]struct {
		params     map[string]string
		statusCode int
	}{
		"good params": {
			map[string]string{
				"from": "USD", "to": "BRL", "amount": "20",
			},
			http.StatusOK,
		},
		"error Amount": {
			map[string]string{
				"from": "USD", "to": "BRL", "amount": "xaz",
			},
			http.StatusInternalServerError,
		},
		"error From": {
			map[string]string{
				"from": "ERR", "to": "BRL", "amount": "20",
			},
			http.StatusInternalServerError,
		},
	}

	for tc, tp := range testCases {
		req, _ := http.NewRequest(http.MethodGet, "/convert", nil)
		q := req.URL.Query()
		for k, v := range tp.params {
			q.Add(k, v)
		}
		req.URL.RawQuery = q.Encode()
		rec := httptest.NewRecorder()
		newController.Convert(rec, req)
		res := rec.Result()
		if res.StatusCode != tp.statusCode {
			t.Errorf("`%v` failed, got %v, expected %v", tc, res.StatusCode, tp.statusCode)
		}
	}
}

func TestCurrencyContollerFindAll(t *testing.T) {
	serviceMock := CurrencyServiceMock{}
	newController := NewCurrencyController(&serviceMock)

	rSuccess := httptest.NewRequest(http.MethodGet, "/currency", nil)
	wSuccess := httptest.NewRecorder()

	newController.FindAll(wSuccess, rSuccess)

	gotSuccess := wSuccess.Result()

	if !reflect.DeepEqual(http.StatusOK, gotSuccess.StatusCode) {
		t.Errorf("wanted: %d, got; %d", http.StatusOK, gotSuccess.StatusCode)
	}
}
