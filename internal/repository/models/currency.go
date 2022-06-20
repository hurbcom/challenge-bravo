package models

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
	"time"
)

// Currency represents a currency on repository
type Currency struct {
	Name      string     `json:"name,omitempty" bson:"name,omitempty"`
	Code      string     `json:"code,omitempty" bson:"code,omitempty"`
	Price     *float64   `json:"price,omitempty" bson:"price,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty" bson:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" bson:"updatedAt,omitempty"`
}

// NewCurrency creates a new currency
func NewCurrency(name string, code string, price *float64, updatedAt *time.Time) *Currency {
	if updatedAt == nil {
		now := time.Now().UTC()
		updatedAt = &now
	}
	return &Currency{Name: name, Code: code, Price: price, UpdatedAt: updatedAt}
}

// GetPriceString returns the price as a string
func (c *Currency) GetPriceString() string {
	return fmt.Sprintf("%f", *c.Price)
}

// ParseToMap converts the currency to a map
func (c *Currency) ParseToMap() (map[string]interface{}, error) {
	var dBytes, err = bson.Marshal(*c)
	if err != nil {
		return nil, err
	}
	var resp map[string]interface{}
	err = bson.Unmarshal(dBytes, &resp)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

// Validate validates the currency
func (c *Currency) Validate() map[string]string {
	var errors = make(map[string]string, 0)
	if c.Name == "" {
		errors["name"] = "name is required"
	}

	if c.Price == nil {
		errors["price"] = "price is required"
	}
	var err = c.ValidateCode()
	if err != nil {
		errors = err
	}
	if len(errors) > 0 {
		return errors
	}
	return nil
}

// ValidateCode validates the code of the currency
func (c *Currency) ValidateCode() map[string]string {
	var err map[string]string
	if c.Code == "" {
		err["code"] = "code is required"
		return err
	}
	c.Code = strings.ToUpper(c.Code)
	return nil
}
