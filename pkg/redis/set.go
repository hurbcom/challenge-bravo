package aredis

import (
	"context"
	"encoding/json"
	"time"
)

func Set(ctx context.Context, key string, value any, ttl int) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	if err := client.Set(ctx, key, jsonData, time.Duration(ttl)).Err(); err != nil {
		return err

	}

	return nil
}
