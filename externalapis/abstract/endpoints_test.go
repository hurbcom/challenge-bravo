package abstract

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestEndpoints(t *testing.T) {
	assert := assert.New(t)

	for index, tc := range []struct {
		want string
		f    func() string
	}{
		{
			"/live?api_key=api-key&base=USD",
			func() string {
				return EndpointGetLive("USD", nil, "api-key")
			},
		},
		{
			"/live?api_key=api-key&base=USD&target=EUR,BRL",
			func() string {
				return EndpointGetLive("USD", []string{"EUR", "BRL"}, "api-key")
			},
		},
	} {
		s := tc.f()
		assert.Equal(tc.want, s, fmt.Sprintf("error at index %d", index))
	}
}
