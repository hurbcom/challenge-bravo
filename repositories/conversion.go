package repositories

import (
	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"gorm.io/gorm"
)

type conversionRepository struct {
	db *gorm.DB
}

type ConversionRepository interface {
	CreateConversion(conversion *entities.Conversion) error
}

func InitializeConversionRepository(db *gorm.DB) ConversionRepository {
	return &conversionRepository{db}
}

func (repository *conversionRepository) CreateConversion(conversion *entities.Conversion) error {
	if result := repository.db.Create(&conversion); result.Error != nil {
		return result.Error
	}

	return nil
}
