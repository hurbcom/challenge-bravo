package currency

import (
	"github.com/iiurydias/challenge-bravo/api/application/client"
	log "github.com/sirupsen/logrus"
)

type Currency struct {
	grpcClient client.Client
}

type currency struct {
	Code string `json:"code"`
}

func New(grpcClient client.Client) *Currency {
	return &Currency{grpcClient: grpcClient}
}

func logError(err error) {
	if err != nil {
		log.Errorln(err)
	}
}
