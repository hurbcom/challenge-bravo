package models

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
	"time"
)

type Currency struct {
	Name      string     `json:"name,omitempty" bson:"name,omitempty"`
	Code      string     `json:"code,omitempty" bson:"code,omitempty"`
	Price     *float64   `json:"price,omitempty" bson:"price,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty" bson:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"time,omitempty" bson:"updatedAt,omitempty"`
}

func (c *Currency) GetCode() string {
	return strings.ToUpper(c.Code)
}

func (c *Currency) SetCode(code string) {
	c.Code = strings.ToUpper(code)
}

func (c *Currency) GetPrice() float64 {
	return *c.Price
}

func (c *Currency) GetPriceString() string {
	return fmt.Sprintf("%f", c.GetPrice())
}

func (c *Currency) GetName() string {
	return c.Name
}

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

func (c *Currency) ValidateCode() map[string]string {
	var err map[string]string
	if c.Code == "" {
		err["code"] = "code is required"
		return err
	}
	c.Code = strings.ToUpper(c.Code)
	return nil
}
