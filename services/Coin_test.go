package services

import (
	"reflect"
	"testing"

	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/subosito/gotenv"
)

func TestMain(m *testing.M) {
	gotenv.Load("../.env")
	dao.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
	m.Run()
}

func TestCreateCoin(t *testing.T) {
	type args struct {
		newCoin models.Coin
	}
	tests := []struct {
		name    string
		args    args
		want    *models.Coin
		wantErr bool
	}{
		{
			name: "TestCreateCoin_ok",
			args: args{
				newCoin: models.Coin{
					Symbol: "ARS",
				},
			},
			want: &models.Coin{
				Symbol: "ARS",
			},
			wantErr: false,
		},
		{
			name: "TestCreateCoin_!ok",
			args: args{
				newCoin: models.Coin{
					Symbol: "999",
				},
			},
			want: &models.Coin{
				Symbol: "999",
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := CreateCoin(tt.args.newCoin)
			if (err != nil) != tt.wantErr {
				t.Errorf("CreateCoin() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(*got, *tt.want) {
				t.Errorf("CreateCoin() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDeleteCoin(t *testing.T) {
	type args struct {
		coin models.Coin
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name:    "TestDeleteCoin_ok",
			args:    args{coin: models.Coin{Symbol: "USD"}},
			wantErr: false,
		},
		{
			name:    "TestDeleteCoin_!ok",
			args:    args{coin: models.Coin{Symbol: "JPY"}},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := DeleteCoin(tt.args.coin); (err != nil) != tt.wantErr {
				t.Errorf("DeleteCoin() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
