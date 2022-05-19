package model

import (
	"reflect"
	"testing"
)

func TestCurrencyConversion_ToJSONResponse(t *testing.T) {
	type fields struct {
		ID             string
		USDValue       float64
		Converted      bool
		From           string
		To             string
		Amount         float64
		ConvertedValue float64
		Error          error
	}
	tests := []struct {
		name   string
		fields fields
		want   JSONResponse
	}{
		{
			name: "success test",
			fields: fields{
				Amount:         10.00,
				Converted:      true,
				Error:          nil,
				From:           "ABC",
				To:             "USD",
				ConvertedValue: 15.00,
			},
			want: JSONResponse{
				Converted: true,
				Value:     15.00,
				ConvertRequest: ConvertRequest{
					From:   "ABC",
					To:     "USD",
					Amount: 10.00,
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			q := CurrencyConversion{
				ID:             tt.fields.ID,
				USDValue:       tt.fields.USDValue,
				Converted:      tt.fields.Converted,
				From:           tt.fields.From,
				To:             tt.fields.To,
				Amount:         tt.fields.Amount,
				ConvertedValue: tt.fields.ConvertedValue,
				Error:          tt.fields.Error,
			}
			if got := q.ToJSONResponse(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CurrencyConversion.ToJSONResponse() = %v, want %v", got, tt.want)
			}
		})
	}
}
