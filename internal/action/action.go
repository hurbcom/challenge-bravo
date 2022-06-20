package action

import (
	"context"
)

type Action interface {
	Act(ctx context.Context)
}
