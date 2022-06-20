package models

import (
	"go.mongodb.org/mongo-driver/bson"
	"strings"
	"time"
)

type CurrencyPrice struct {
	Code      string `json:"code,omitempty" bson:"code,omitempty"`
	Price     string `json:"bid,omitempty" bson:"price,omitempty"`
	Name      string `json:"name,omitempty" bson:"name,omitempty"`
	UpdatedAt string `json:"create_date,omitempty" bson:"updatedAt,omitempty"`
}

func (c *CurrencyPrice) ParseToMap() (map[string]interface{}, error) {
	var dBytes, err = bson.Marshal(c)
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

func (c *CurrencyPrice) Validate() map[string]string {
	var errors = make(map[string]string, 0)
	if err := c.ValidateCode(); err != nil {
		errors = err
	}
	if c.Price == "" {
		errors["price"] = "price is required"
	}
	c.ValidateTime()
	return errors
}

func (c *CurrencyPrice) ValidateCode() map[string]string {
	var err map[string]string
	if c.Code == "" {
		err["code"] = "code is required"
		return err
	}
	c.Code = strings.ToUpper(c.Code)
	return nil
}

func (c *CurrencyPrice) ValidateTime() {
	if c.UpdatedAt != "" {
		timeParsed, err := time.Parse("2006-01-02 15:04:05", c.UpdatedAt)
		if err != nil {
			c.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
		}
		c.UpdatedAt = timeParsed.Format(time.RFC3339)
	}
}
