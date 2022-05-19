package env

import (
	"context"

	"github.com/pkg/errors"
	"github.com/sethvargo/go-envconfig"
)

// MutatorFunc should be used when you want to change environment value before returning for use.
type MutatorFunc func(ctx context.Context, k, v string) (string, error)

// LoadEnv bring a set of environment variables defined in dst with prefix. Mutators provide a way to change environment
// variables before defining dst value. We wrap github.com/sethvargo/go-envconfig functionality.
func LoadEnv(ctx context.Context, dst interface{}, prefix string, mutators ...MutatorFunc) error {
	envconfigMutators := make([]envconfig.MutatorFunc, len(mutators))
	for i := range mutators {
		envconfigMutators[i] = envconfig.MutatorFunc(mutators[i])
	}

	l := envconfig.PrefixLookuper(prefix, envconfig.OsLookuper())
	if err := envconfig.ProcessWith(ctx, dst, l, envconfigMutators...); err != nil {
		return errors.Wrap(err, "error while creating config from environment")
	}

	return nil
}
