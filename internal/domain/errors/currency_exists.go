package errors

import "fmt"

type CurrencyAlreadyExists struct {
	Name string
}

func (c *CurrencyAlreadyExists) Error() string {
	return fmt.Sprintf("Currency with name %s already exists", c.Name)
}
