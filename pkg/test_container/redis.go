package testcontainer

import (
	"context"
	"fmt"
	"log"
	"path"
	"runtime"

	"github.com/docker/go-connections/nat"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/redis"
)

func SetupRedis() *ContainerResult {
	ctx := context.Background()

	_, filename, _, _ := runtime.Caller(0)

	conf := path.Join(path.Dir(filename), "./conf/redis.conf")

	redisContainer, err := redis.Run(ctx,
		"redis:latest",
		redis.WithLogLevel(redis.LogLevelVerbose),
		redis.WithConfigFile(conf),
		testcontainers.WithLogConsumers(&LogConsumer{}),
	)
	if err != nil {
		log.Fatal(err)
	}

	host, err := redisContainer.Host(ctx)
	if err != nil {
		log.Fatalf("Host error: %s", err)
	}
	port, err := redisContainer.MappedPort(ctx, nat.Port(fmt.Sprintf("%d/tcp", 6379)))
	if err != nil {
		log.Fatalf("Port error: %s", err)
	}

	return &ContainerResult{
		container: redisContainer,
		ctx:       ctx,
		Host:      host,
		Port:      uint(port.Int()),
	}
}
