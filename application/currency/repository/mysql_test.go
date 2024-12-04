package repository

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	migrateAndSeed(db)
	return db
}

func TestNewRepository(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)
	assert.NotNil(t, repo)
}

func TestGetByID(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)

	id := string("1")
	currency, err := repo.GetByID(&id)
	assert.Nil(t, err)
	assert.NotNil(t, currency)
	assert.Equal(t, BC_CODE, currency.Code)
}

func TestList(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)

	response, err := repo.List()
	assert.Nil(t, err)
	assert.NotNil(t, response)
	assert.Greater(t, len(response.Currencies), 0)
}

func TestCreate(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)

	currency, err := repo.Create("EUR", "Euro", "0.85", false)
	assert.Nil(t, err)
	assert.NotNil(t, currency)
	assert.Equal(t, "EUR", currency.Code)
}

func TestUpdate(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)

	currency, err := repo.Update("1", "USD", "US Dollar", "1", true)
	assert.Nil(t, err)
	assert.NotNil(t, currency)
	assert.Equal(t, "US Dollar", currency.Name)
}

func TestDelete(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)

	id := string("1")
	err := repo.Delete(&id)
	assert.Nil(t, err)

	currency, err := repo.GetByID(&id)
	assert.NotNil(t, err)
	assert.Nil(t, currency)
}

func TestGetByCodes(t *testing.T) {
	db := setupTestDB()
	repo := NewRepository(db)

	codes := []string{"USD", "EUR"}
	response, err := repo.GetByCodes(codes)
	assert.Nil(t, err)
	assert.NotNil(t, response)
	assert.Greater(t, len(response.Currencies), 0)
}
