package repositories

import (
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"gorm.io/gorm"
)

type conversionRepository struct {
	db *gorm.DB
}

type ConversionRepository interface {
	CreateConversion(conversion *models.Conversion) error
}

func InitializeConversionRepository(db *gorm.DB) ConversionRepository {
	return &conversionRepository{db}
}

func (repository *conversionRepository) CreateConversion(conversion *models.Conversion) error {
	if result := repository.db.Create(&conversion); result.Error != nil {
		return result.Error
	}

	return nil
}
