package action

import (
	"context"
)

// Action is the interface to create actions
type Action interface {
	Act(ctx context.Context)
}
