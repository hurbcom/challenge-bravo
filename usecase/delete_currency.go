package usecase

import "github.com/VictorNapoles/challenge-bravo/gateway/repository"

type (
	DeleteCurrencyDto struct {
		CurrencyCode string
	}

	DeleteCurrency interface {
		Execute(dto *DeleteCurrencyDto) error
	}

	deleteCurrencyImpl struct {
		currencyRepository repository.CurrencyRepository
	}
)

func NewDeleteCurrency(currencyRepository repository.CurrencyRepository) DeleteCurrency {
	return &deleteCurrencyImpl{currencyRepository: currencyRepository}
}

func (d *deleteCurrencyImpl) Execute(dto *DeleteCurrencyDto) error {
	if dto.CurrencyCode == "" {
		return &UsecaseError{Message: "Currency code can  not be null or empty"}
	}

	currencyEntity, err := d.currencyRepository.GetByCode(dto.CurrencyCode)
	if err != nil {
		return err
	}

	if currencyEntity.Code == "" {
		return &UsecaseError{Message: "Currency not found"}
	}

	if !currencyEntity.Deletable {
		return &UsecaseError{Message: "Currency is not deletable"}
	}

	_, err = d.currencyRepository.Delete(dto.CurrencyCode)
	if err != nil {
		return err
	}

	return nil
}
