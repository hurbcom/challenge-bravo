package model

// Constants
const (
	EnvPortKey          = "BRAVO_PORT"               // EnvPortKey Server port number environment variable name
	EnvHostKey          = "BRAVO_HOST"               // EnvHostKey Server host name environment variable name
	EnvCertFileKey      = "BRAVO_CERT_FILE"          // EnvCertFileKey Server certificate file path environment variable name
	EnvKeyFileKey       = "BRAVO_KEY_FILE"           // EnvKeyFileKey Server certificate key file path environment variable name
	EnvDBKey            = "BRAVO_DB"                 // EnvDBKey Database connection string (postgres) environment variable name
	EnvCacheKey         = "BRAVO_CACHE"              // EnvCacheKey CacheContainer connection string (redis) environment variable name
	EnvFixerKey         = "BRAVO_FIXER_KEY"          // EnvFixerKey fixer currency quote API key environment variable name
	EnvCoinLayerKey     = "BRAVO_COIN_LAYER_KEY"     // EnvCoinLayerKey Coin layer crypto currency quote API key environment variable name
	EnvCurrencyLayerKey = "BRAVO_CURRENCY_LAYER_KEY" // EnvCurrencyLayerKey Currency layer currency quote API key environment variable name

	DefaultPort = 8080       // DefaultPort Default server port
	DefaultHost = "===xx===" // DefaultHost Default server host, will be replaced by "" on server startup
)
