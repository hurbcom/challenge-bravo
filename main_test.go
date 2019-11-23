package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"gotest.tools/assert"

	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/subosito/gotenv"
)

var router *gin.Engine

func TestMain(m *testing.M) {
	gotenv.Load()
	dao.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
	router = SetUpRoutes()

	m.Run()
}

var requestJSON = []byte(`{
	{
		"symbol":"ARS"
	}`)

// * Integrations test
func Test_Conversor(t *testing.T) {
	tests := []struct {
		name    string
		from    string
		to      string
		amount  string
		wantErr bool
	}{
		{
			name:    "Test_Converso_Deafult_Request",
			from:    "USD",
			to:      "BRL",
			amount:  "132.123",
			wantErr: false,
		},
		{
			name:    "Test_Converso_Deafult_NotFound",
			from:    "USD",
			to:      "ARS",
			amount:  "132.123",
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/price-conversion", nil)
			q := url.Values{}
			q.Add("from", tt.from)
			q.Add("to", tt.to)
			q.Add("amount", tt.amount)
			req.URL.RawQuery = q.Encode()
			router.ServeHTTP(w, req)
			assert.Equal(t, 200, w.Code)

		})
	}
}

func Test_NewCoin(t *testing.T) {
	tests := []struct {
		name    string
		symbol  string
		wantErr bool
	}{
		{
			name:    "Test_NewCoin_ok",
			symbol:  "ARS",
			wantErr: false,
		},
		{
			name:    "Test_NewCoin_!ok",
			symbol:  "999",
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			requestBody, err := json.Marshal(map[string]string{
				"symbol": tt.symbol,
			})
			if err != nil {
				t.Log("error : ", err)
				t.Skip()
			}
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/price-conversion", bytes.NewBuffer(requestBody))
			router.ServeHTTP(w, req)
			assert.Equal(t, 200, w.Code)
		})
	}
}

func Test_DeleteCoin(t *testing.T) {
	tests := []struct {
		name    string
		symbol  string
		wantErr bool
	}{
		{
			name:    "Test_DeleteCoin_ok",
			symbol:  "USD",
			wantErr: false,
		},
		{
			name:    "Test_DeleteCoin_!ok",
			symbol:  "999",
			wantErr: true,
		},
		{
			name:    "Test_DeleteCoin_ok",
			symbol:  "LTC",
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("DELETE", "/coin"+tt.symbol, nil)
			router.ServeHTTP(w, req)
			assert.Equal(t, 200, w.Code)
		})
	}
}
