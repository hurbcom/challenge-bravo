package usecase

import "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"

type Currency struct{}

func (*Currency) NewCurrency() *Currency {
	return &Currency{}
}

func (*Currency) Get() {

}

func validate(currencyModel model.Currency) error {
	return nil
}
