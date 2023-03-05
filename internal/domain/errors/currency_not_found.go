package errors

import "fmt"

type CurrencyNotFound struct {
	Name string
}

func (c *CurrencyNotFound) Error() string {
	return fmt.Sprintf("Currency with name %s not found", c.Name)
}
