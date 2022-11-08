package usecases

import (
	"errors"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
)

type conversionUsecase struct {
	conversionRepository repositories.ConversionRepository
}

type ConversionUsecase interface {
	CreateConversion(conversion *entities.Conversion) error
}

func InitializeConversionUsecase(repository repositories.ConversionRepository) ConversionUsecase {
	return &conversionUsecase{repository}
}

func (usecase *conversionUsecase) CreateConversion(conversion *entities.Conversion) error {
	if conversion == nil {
		return errors.New("conversion is nil")
	}

	if !conversion.IsValid() {
		return errors.New("From, To, Amount and result cannot be empty")
	}

	err := usecase.conversionRepository.CreateConversion(conversion)
	if err != nil {
		return err
	}
	return nil
}
