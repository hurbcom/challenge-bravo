package repository

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

const (
	BC_CODE          = "USD"
	BC_NAME          = "Dollar"
	BC_CURRENCY_RATE = "1"
	BC_STATUS        = true
)

// TableName - force the table name
func (Currency) TableName() string {
	return "currency"
}

// Currency Table
type Currency struct {
	ID              uint   `gorm:"primary_key"`
	Code            string `gorm:"type:varchar(20);index"`
	Name            string `gorm:"type:varchar(60);"`
	BackingCurrency bool   `gorm:"default:false"`
	CurrencyRate    string `gorm:"type:varchar(20);"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       gorm.DeletedAt `gorm:"index"`
}

// repository struct
type repository struct {
	db *gorm.DB
}

// NewRepository creates a new currency repository
func NewRepository(db *gorm.DB) Repository {
	migrateAndSeed(db)
	return &repository{db: db}
}

// GetByID retrieves a currency by its ID
func (r *repository) GetByID(id *string) (*Currency, error) {
	var currency Currency
	if err := r.db.First(&currency, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &currency, nil
}

func (r *repository) List() (*ResponseList, error) {
	var currencies []Currency
	if err := r.db.Find(&currencies).Error; err != nil {
		return nil, err
	}

	currencyPointers := make([]*Currency, len(currencies))
	for i := range currencies {
		currencyPointers[i] = &currencies[i]
	}

	return &ResponseList{
		Currencies: currencyPointers,
	}, nil
}

func (r *repository) Create(code, name, currency_rate string, backing_currency bool) (*Currency, error) {
	newCurrency := Currency{
		Code:            code,
		Name:            name,
		BackingCurrency: backing_currency,
		CurrencyRate:    currency_rate,
	}
	removeBackingFromAll(backing_currency, r)
	result := r.db.Create(&newCurrency)
	return &newCurrency, result.Error
}

func (r *repository) Update(id, code, name, currency_rate string, backing_currency bool) (*Currency, error) {
	var existingCurrency Currency
	if err := r.db.First(&existingCurrency, "id = ?", &id).Error; err != nil {
		return nil, err
	}
	if notEmpty(code) {
		existingCurrency.Code = code
	}
	if notEmpty(name) {
		existingCurrency.Name = name
	}
	if notEmpty(currency_rate) {
		existingCurrency.CurrencyRate = currency_rate
	}
	existingCurrency.BackingCurrency = backing_currency
	removeBackingFromAll(backing_currency, r)
	result := r.db.Save(&existingCurrency)
	return &existingCurrency, result.Error
}

func removeBackingFromAll(backing_currency bool, r *repository) {
	if backing_currency {
		r.db.Model(&Currency{}).Where("backing_currency = ?", true).Update("backing_currency", false)
	}
}

func (r *repository) Delete(id *string) error {
	return r.db.Delete(&Currency{}, "id = ?", id).Error
}

func (r *repository) GetByCodes(codes []string) (*ResponseList, error) {
	var bcExists bool
	if len(codes) == 0 {
		return nil, errors.New("no codes provided")
	}

	var currencies []Currency
	if err := r.db.Where("code IN ?", codes).Find(&currencies).Error; err != nil {
		return nil, err
	}

	currencyPointers := make([]*Currency, len(currencies))
	for i := range currencies {
		bcExists = bcExists || currencies[i].BackingCurrency
		currencyPointers[i] = &currencies[i]
	}

	if !bcExists {
		bc, err := getBackingCurrency(r)
		if err == gorm.ErrRecordNotFound {
			bc = firstCurrency()
		}
		currencyPointers = append(currencyPointers, bc)
	}
	return &ResponseList{
		Currencies: currencyPointers,
	}, nil
}

func getBackingCurrency(r *repository) (*Currency, error) {
	var currency Currency
	if err := r.db.First(&currency, "backing_currency = ?", true).Error; err != nil {
		return nil, err
	}
	return &currency, nil
}

func firstCurrency() *Currency {
	return &Currency{
		Code:            BC_CODE,
		Name:            BC_NAME,
		CurrencyRate:    BC_CURRENCY_RATE,
		BackingCurrency: BC_STATUS,
	}
}

func migrateAndSeed(db *gorm.DB) {
	db.AutoMigrate(
		&Currency{},
	)
	// Add USD to currency table
	bc := firstCurrency()
	if db.Migrator().HasTable(&Currency{}) {
		if err := db.First(bc).Error; errors.Is(err, gorm.ErrRecordNotFound) {
			db.Create(bc)
		}
	}
}
