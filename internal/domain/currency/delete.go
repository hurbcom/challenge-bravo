package currency

import (
	"context"
	"fmt"
)

func (d *Domain) Delete(c context.Context, code string) error {
	var err = d.repository.DeletePrice(c, code)
	if err != nil {
		return fmt.Errorf("error deleting data from mongo: %w", err)
	}
	return nil
}
