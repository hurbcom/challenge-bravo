package main_test

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"bytes"
	"encoding/json"

	"github.com/EltonARodrigues/currency-api-go/app/routers"
)


func TestGetAlValues(t *testing.T) {

	req, err := http.NewRequest("GET", "/currencys", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	routers.SetRouters().ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

}

func TestGetOneCurrency(t *testing.T) {

	req, _ := http.NewRequest("GET", "/currencys/BRL", nil)
	res := executeRequest(req)

	if status := res.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

}

func TestInsertCurrency(t *testing.T) {
	var payload string
	payload = `{"code":"111","usd_value":1.5}`

	req1, _ := http.NewRequest("POST", "/currencys", bytes.NewBuffer([]byte(payload)))
	response1 := executeRequest(req1)

	payload = `{"code":"222","usd_value":2.2}`
	req2, _ := http.NewRequest("POST", "/currencys", bytes.NewBuffer([]byte(payload)))
	response2 := executeRequest(req2)

	checkResponseCode(t, http.StatusCreated, response1.Code)
	checkResponseCode(t, http.StatusCreated, response2.Code)
}

func TestCurrencyConvertion(t *testing.T) {
	req, _ := http.NewRequest("GET", "/convert/?from=111&to=222&amount=100",nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)

	if m["amount_converted"] != 68.18 {
		t.Errorf("Expected . Got '%v'", m["amount_converted"])
	}
}
func TestCurrencyDelete(t *testing.T) {
	req1, _ := http.NewRequest("DELETE", "/currencys/111",nil)
	response1 := executeRequest(req1)

	req2, _ := http.NewRequest("DELETE", "/currencys/222", nil)

	response2 := executeRequest(req2)

	checkResponseCode(t, http.StatusOK, response1.Code)
	checkResponseCode(t, http.StatusOK, response2.Code)
}

func executeRequest(req *http.Request) *httptest.ResponseRecorder {
    rr := httptest.NewRecorder()
    routers.SetRouters().ServeHTTP(rr, req)

    return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
    if expected != actual {
        t.Errorf("Expected response code %d. Got %d\n", expected, actual)
    }
}