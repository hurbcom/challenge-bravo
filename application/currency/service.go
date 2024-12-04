package currency

import (
	"github.com/danielmalka/challenge-bravo/application/currency/repository"
	"gorm.io/gorm"
)

type Service struct {
	repo repository.Repository
}

func NewService(db *gorm.DB) *Service {
	return &Service{
		repo: repository.NewRepository(db),
	}
}

// Get retrieves a currency by its ID
func (s *Service) Get(id string) (*Currency, error) {
	currency, err := s.repo.GetByID(&id)
	if err != nil {
		return nil, err
	}
	return dbToEntity(currency), nil
}

// List retrieves a list of currencies
func (s *Service) List() ([]*Currency, error) {
	respList, err := s.repo.List()
	if err != nil {
		return nil, err
	}
	return dbToEntities(respList.Currencies), nil
}

// Create creates a new currency
func (s *Service) Create(c *CreateData) (*Currency, error) {
	newCurrency, err := s.repo.Create(c.Code, c.Name, c.CurrencyRate, c.BackingCurrency)
	return dbToEntity(newCurrency), err
}

// Update updates an existing currency
func (s *Service) Update(c *UpdateData) (*Currency, error) {
	existingCurrency, err := s.repo.Update(c.ID, c.Code, c.Name, c.CurrencyRate, c.BackingCurrency)
	if err != nil {
		return nil, err
	}
	return dbToEntity(existingCurrency), err
}

// Delete deletes a currency by its ID
func (s *Service) Delete(id string) error {
	return s.repo.Delete(&id)
}

// GetByCodes get a list of currencies by their codes
func (s *Service) GetByCodes(code ...string) ([]*Currency, error) {
	respList, err := s.repo.GetByCodes(code)
	if err != nil {
		return nil, err
	}
	return dbToEntities(respList.Currencies), nil
}
