package model

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewCurrencyConversion(t *testing.T) {
	type args struct {
		id       string
		usdValue float64
	}
	tests := []struct {
		name    string
		args    args
		want    CurrencyConversion
		wantErr bool
	}{
		{
			name: "success test",
			args: args{
				id:       "ABC",
				usdValue: 1.05,
			},
			want: CurrencyConversion{
				ID:       "ABC",
				USDValue: 1.05,
			},
			wantErr: false,
		},
		{
			name: "success lower case test",
			args: args{
				id:       "def",
				usdValue: 231.15,
			},
			want: CurrencyConversion{
				ID:       "DEF",
				USDValue: 231.15,
			},
			wantErr: false,
		},
		{
			name: "success camel case + decimal points test",
			args: args{
				id:       "Def",
				usdValue: 23.1555,
			},
			want: CurrencyConversion{
				ID:       "DEF",
				USDValue: 23.1555,
			},
			wantErr: false,
		},
		{
			name: "fail empty id test",
			args: args{
				id:       "",
				usdValue: 10,
			},
			want:    CurrencyConversion{},
			wantErr: true,
		},
		{
			name: "fail invalid id test",
			args: args{
				id:       "de",
				usdValue: 5,
			},
			want:    CurrencyConversion{},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := NewCurrencyConversion(tt.args.id, tt.args.usdValue)
			if (err != nil) != tt.wantErr {
				t.Errorf("NewCurrencyConversion() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !assert.Equal(t, got, tt.want) {
				t.Errorf("NewCurrencyConversion() = %v, want %v", got, tt.want)
			}
		})
	}
}
