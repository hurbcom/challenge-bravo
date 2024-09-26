package testcontainer

import (
	"context"

	"github.com/testcontainers/testcontainers-go"
)

type ContainerResult struct {
	container testcontainers.Container
	ctx       context.Context
	Host      string
	Port      uint
}

func (c ContainerResult) Terminate() {
	c.container.Terminate(c.ctx)
}
