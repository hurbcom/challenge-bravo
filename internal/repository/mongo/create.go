package mongo

import (
	"context"
	"fmt"
)

func (e *Engine) Create(ctx context.Context, data interface{}) (interface{}, error) {
	switch data.(type) {
	case []interface{}:
		var data, ok = data.([]interface{})
		if !ok {
			return nil, fmt.Errorf("error parsing data %v", ok)
		}
		return e.collection.InsertMany(ctx, data)
	default:

		return e.collection.InsertOne(ctx, data)

	}
}
