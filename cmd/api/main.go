package main

import (
	"context"
	"log"
	"time"

	"challenge-bravo/internal/api"
	"challenge-bravo/internal/config"
	"challenge-bravo/internal/container"
	"challenge-bravo/pkg/core/env"
	apiServer "challenge-bravo/pkg/core/http"
	"challenge-bravo/pkg/core/types"

	_ "github.com/golang/mock/mockgen/model"
)

func main() {
	ctx := context.Background()

	ctx = context.WithValue(ctx, types.ContextKey(types.Version), config.NewVersion())
	ctx = context.WithValue(ctx, types.ContextKey(types.StartedAt), time.Now())

	ctx, dep, err := container.New(ctx)
	if err != nil {
		log.Fatal(err)
		return
	}

	apiConfig := apiServer.Config{}
	err = env.LoadEnv(ctx, &apiConfig, apiServer.PrefixConfig)
	if err != nil {
		log.Fatal(err)
		return
	}

	apiServer.Run(
		ctx,
		apiConfig,
		api.Handler(ctx, dep),
		dep.Components.Log,
	)

}
