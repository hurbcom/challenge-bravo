package controllers

import (
	"reflect"
	"testing"

	"github.com/Ricardo-Sales/challenge-bravo/cerrors"
	"github.com/Ricardo-Sales/challenge-bravo/models"
)

func TestUnmarshalQuotation(t *testing.T) {
	type args struct {
		body []byte
		code string
	}
	tests := []struct {
		name  string
		args  args
		want  models.Quotation
		want1 cerrors.Cerror
	}{
		{
			name: "teste ok",
			args: args{
				body: []byte(`{"USDBRL": {"code": "USD","codein": "BRL","name": "Dólar Americano/Real Brasileiro",
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": "5.2103","ask": "5.2114","timestamp": "1670002277","create_date": "2022-12-02 14:31:17"
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "USD",
				Codein:     "BRL",
				Name:       "Dólar Americano/Real Brasileiro",
				Value:      "5.2103",
				CreateDate: "2022-12-02 14:31:17",
			},

			want1: cerrors.Cerror{
				Message:     "",
				StatusCode:  0,
				Attribute:   "",
				Description: "",
				Details:     "",
			},
		},

		{
			name: "quebra no code",
			args: args{
				body: []byte(`{"USDBRL": {"code": 123,"codein": "BRL","name": "Dólar Americano/Real Brasileiro",
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": "5.2103","ask": "5.2114","timestamp": "1670002277","create_date": "2022-12-02 14:31:17"
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "",
				Codein:     "",
				Name:       "",
				Value:      "",
				CreateDate: "",
			},

			want1: cerrors.Cerror{
				Message:     "Bad Request",
				StatusCode:  400,
				Attribute:   "code",
				Description: "INVALID_DATA_TYPE",
				Details:     cerrors.ErrInvalidCodeQuot,
			},
		},
		{
			name: "quebra no codein",
			args: args{
				body: []byte(`{"USDBRL": {"code": "USD","codein": true,"name": "Dólar Americano/Real Brasileiro",
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": "5.2103","ask": "5.2114","timestamp": "1670002277","create_date": "2022-12-02 14:31:17"
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "",
				Codein:     "",
				Name:       "",
				Value:      "",
				CreateDate: "",
			},

			want1: cerrors.Cerror{
				Message:     "Bad Request",
				StatusCode:  400,
				Attribute:   "codein",
				Description: "INVALID_DATA_TYPE",
				Details:     cerrors.ErrInvalidCodeInQuot,
			},
		},
		{
			name: "erro 500 no name",
			args: args{
				body: []byte(`{"USDBRL": {"code": "USD","codein": "BRL","name": asvc654,
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": "5.2103","ask": "5.2114","timestamp": "1670002277","create_date": "2022-12-02 14:31:17"
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "",
				Codein:     "",
				Name:       "",
				Value:      "",
				CreateDate: "",
			},

			want1: cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  500,
				Attribute:   "body",
				Description: "ERROR_UNMARSHAL",
				Details:     "error when unmarshal request body from quotation ",
			},
		},
		{
			name: "quebra no name",
			args: args{
				body: []byte(`{"USDBRL": {"code": "USD","codein": "BRL","name": 1234,
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": "5.2103","ask": "5.2114","timestamp": "1670002277","create_date": "2022-12-02 14:31:17"
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "",
				Codein:     "",
				Name:       "",
				Value:      "",
				CreateDate: "",
			},

			want1: cerrors.Cerror{
				Message:     "Bad Request",
				StatusCode:  400,
				Attribute:   "name",
				Description: "INVALID_DATA_TYPE",
				Details:     cerrors.ErrInvalidNameQuot,
			},
		},
		{
			name: "quebra no bid/value",
			args: args{
				body: []byte(`{"USDBRL": {"code": "USD","codein": "BRL","name": "Dólar Americano/Real Brasileiro",
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": true,"ask": "5.2114","timestamp": "1670002277","create_date": "2022-12-02 14:31:17"
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "",
				Codein:     "",
				Name:       "",
				Value:      "",
				CreateDate: "",
			},

			want1: cerrors.Cerror{
				Message:     "Bad Request",
				StatusCode:  400,
				Attribute:   "value",
				Description: "INVALID_DATA_TYPE",
				Details:     cerrors.ErrInvalidValueQuot,
			},
		},
		{
			name: "quebra no create_date",
			args: args{
				body: []byte(`{"USDBRL": {"code": "USD","codein": "BRL","name": "Dólar Americano/Real Brasileiro",
						"high": "5.24","low": "5.1642","varBid": "0.0261","pctChange": "0.5",
						"bid": "5.2103","ask": "5.2114","timestamp": "1670002277","create_date": 20221202143117
					}
				}`),
				code: "USDBRL",
			},
			want: models.Quotation{
				Code:       "",
				Codein:     "",
				Name:       "",
				Value:      "",
				CreateDate: "",
			},

			want1: cerrors.Cerror{
				Message:     "Bad Request",
				StatusCode:  400,
				Attribute:   "create_date",
				Description: "INVALID_DATA_TYPE",
				Details:     cerrors.ErrInvalidCreateDateQuot,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := UnmarshalQuotation(tt.args.body, tt.args.code)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("UnmarshalQuotation() got = %v, want %v", got, tt.want)
			}
			if !reflect.DeepEqual(got1, tt.want1) {
				t.Errorf("UnmarshalQuotation() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}
