package models

import (
	"os"
	"reflect"
	"testing"
)

func setup() {
	SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
}
func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	os.Exit(code)
}
func TestGetSuportedCoins(t *testing.T) {
	tests := []struct {
		name string
		want []string
	}{
		{
			name: "default",
			want: []string{"USD", "BRL", "EUR", "BTC", "ETH"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetSuportedCoins(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetSuportedCoins() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCoin_StoreContains(t *testing.T) {
	type fields struct {
		Symbol string
	}
	tests := []struct {
		name   string
		fields fields
		want   bool
	}{
		{
			name:   "ok",
			fields: fields{Symbol: "USD"},
			want:   true,
		},
		{
			name:   "lowerCase",
			fields: fields{Symbol: "usd"},
			want:   true,
		},
		{
			name:   "dont' exist",
			fields: fields{Symbol: "JPC"},
			want:   false,
		},
		{
			name:   "dont' exist2",
			fields: fields{Symbol: "999"},
			want:   false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := &Coin{
				Symbol: tt.fields.Symbol,
			}
			if got := c.StoreContains(); got != tt.want {
				t.Errorf("Coin.StoreContains() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCoin_DeleteCoin(t *testing.T) {
	type fields struct {
		Symbol string
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := &Coin{
				Symbol: tt.fields.Symbol,
			}
			if err := c.DeleteCoin(); (err != nil) != tt.wantErr {
				t.Errorf("Coin.DeleteCoin() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestCoinExchange_ValidateCoin(t *testing.T) {
	type fields struct {
		From            string
		To              string
		Amount          float64
		Priceconversion map[string]Quote
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := &CoinExchange{
				From:            tt.fields.From,
				To:              tt.fields.To,
				Amount:          tt.fields.Amount,
				Priceconversion: tt.fields.Priceconversion,
			}
			if err := c.ValidateCoin(); (err != nil) != tt.wantErr {
				t.Errorf("CoinExchange.ValidateCoin() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
