package helpers

import (
	"os"

	"github.com/pkg/errors"
)

const (
	appPort            = "APP_PORT"
	appBackingCurrency = "APP_BACKING_CURRENCY"
	appExchangeApiKey  = "APP_EXCHANGE_API_KEY"
	appExchangeApiUrl  = "APP_EXCHANGE_API_URL"
	dbUrl              = "DB_HOST"
	dbUser             = "DB_USER"
	dbPassword         = "DB_PASSWORD"
	dbName             = "DB_NAME"
)

type env struct {
	AppPort             string
	BackingCurrencyCode string
	ExchangeApiUrl      string
	ExchangeApiKey      string
	DbHost              string
	DbUser              string
	DbPassword          string
	DbName              string
}

var Env *env = &env{}

func LoadEnv() error {
	var exist bool
	if Env.AppPort, exist = os.LookupEnv(appPort); !exist {
		return errors.Errorf("env variable \"%s\" not set", appPort)
	}
	if Env.BackingCurrencyCode, exist = os.LookupEnv(appBackingCurrency); !exist {
		return errors.Errorf("env variable \"%s\" not set", appBackingCurrency)
	}
	if Env.ExchangeApiUrl, exist = os.LookupEnv(appExchangeApiUrl); !exist {
		return errors.Errorf("env variable \"%s\" not set", appExchangeApiUrl)
	}
	if Env.ExchangeApiKey, exist = os.LookupEnv(appExchangeApiKey); !exist {
		return errors.Errorf("env variable \"%s\" not set", appExchangeApiKey)
	}
	if Env.DbHost, exist = os.LookupEnv(dbUrl); !exist {
		return errors.Errorf("env variable \"%s\" not set", dbUrl)
	}
	if Env.DbUser, exist = os.LookupEnv(dbUser); !exist {
		return errors.Errorf("env variable \"%s\" not set", dbUser)
	}
	if Env.DbPassword, exist = os.LookupEnv(dbPassword); !exist {
		return errors.Errorf("env variable \"%s\" not set", dbPassword)
	}
	if Env.DbName, exist = os.LookupEnv(dbName); !exist {
		return errors.Errorf("env variable \"%s\" not set", dbName)
	}
	return nil
}
