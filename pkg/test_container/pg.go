package testcontainer

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/docker/go-connections/nat"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

type PgConfig struct {
	Image    string
	Database string
	User     string
	Password string
}

func SetupPG(pg PgConfig) *ContainerResult {
	ctx := context.Background()

	postgresContainer, err := postgres.RunContainer(ctx,
		testcontainers.WithImage(pg.Image),
		postgres.WithDatabase(pg.Database),
		testcontainers.WithLogConsumers(&LogConsumer{}),
		postgres.WithUsername(pg.User),
		postgres.WithPassword(pg.Password),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(5*time.Second)),
	)
	if err != nil {
		log.Fatal(err)
	}

	host, err := postgresContainer.Host(ctx)
	if err != nil {
		log.Fatalf("Host error: %s", err)
	}
	port, err := postgresContainer.MappedPort(ctx, nat.Port(fmt.Sprintf("%d/tcp", 5432)))
	if err != nil {
		log.Fatalf("Port error: %s", err)
	}

	return &ContainerResult{
		container: postgresContainer,
		ctx:       ctx,
		Host:      host,
		Port:      uint(port.Int()),
	}
}
