package mongo

import (
	"context"
	"fmt"
)

func (e *Engine) Get(ctx context.Context, filter interface{}) (interface{}, error) {
	var cur, err = e.collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("error getting data from mongo: %w", err)
	}
	err = cur.Err()
	if err != nil {
		return nil, fmt.Errorf("error on cursor from mongo: %w", err)
	}
	defer func(ctx context.Context) {
		var err = cur.Close(ctx)
		if err != nil {
			panic(err)
		}
	}(ctx)
	var result []interface{}
	for cur.Next(ctx) {
		var doc map[string]interface{}
		err = cur.Decode(&doc)
		if err != nil {
			return nil, fmt.Errorf("error decoding data from mongo: %w", err)
		}
		result = append(result, doc)
	}
	return result, nil
}
