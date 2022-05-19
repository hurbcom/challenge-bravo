/*
Package env provides helper functions to load environment variables with some degree of control of behavior like: empty,
prefixes, default and mutators. All these beneficits come from github.com/sethvargo/go-envconfig.
Basics:
Define your configuration struct:
	type MyConfig struct{
		User     string       `env:"USER,default=xpto"`
		Password string       `env:"PASSWORD,required"`
		Timeout time.Duration `env:"TIMEOUT,default=10s"`
	}
Somewhere create a instance of MyConfig and call LoadEnv:
	var config MyConfig
	if err := LoadEnv(ctx, &config, "PREFIX_"); err != nil {
		...
	}
*/
package env
