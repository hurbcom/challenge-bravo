package services

import (
	"testing"

	"github.com/hurbcom/challenge-bravo/models"
)

func TestConvert(t *testing.T) {
	type args struct {
		coin models.CoinExchange
	}
	tests := []struct {
		name    string
		args    args
		want    float64
		wantErr bool
	}{
		{
			name: "TestConvert_ok",
			args: args{
				coin: models.CoinExchange{
					From:   "USD",
					To:     "USD",
					Amount: 123.123,
				},
			},
			want:    123.123,
			wantErr: false,
		},
		{
			name: "TestConvert_!ok",
			args: args{
				coin: models.CoinExchange{
					From:   "USD",
					To:     "999",
					Amount: 123.123,
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Convert(tt.args.coin)
			if (err != nil) != tt.wantErr {
				t.Errorf("Convert() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Convert() = %v, want %v", got, tt.want)
			}
		})
	}
}
