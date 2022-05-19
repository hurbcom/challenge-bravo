package env

import (
	"embed"

	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

func ViperConfig(embeds embed.FS) (*viper.Viper, error) {
	viperSetup := viper.GetViper()
	viperSetup.SetConfigType("env")

	if appFile, err := embeds.Open("env/application.env"); err == nil {
		defer appFile.Close()
		if err := viperSetup.ReadConfig(appFile); err != nil {
			return nil, errors.Wrap(err, "viper cannot read configuration")
		}
	}

	viperSetup.AllowEmptyEnv(false)
	viperSetup.AutomaticEnv()

	return viperSetup, nil
}
