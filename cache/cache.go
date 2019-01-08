package cache

import (
	"challenge-bravo/logger"
	"challenge-bravo/util"
	"time"

	"github.com/allegro/bigcache"
	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log
var Cache *bigcache.BigCache
var err error

// StartCache :: Function responsible to initialize the cache service
func StartCache() {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	log.Info("• Initializing cache...")

	Cache, err = bigcache.NewBigCache(bigcache.DefaultConfig(30 * time.Minute))
	if err != nil {
		log.Error(err)
	}
}

// Get :: Shortcut function to Get value from a key in cache
func Get(key string) (string, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	entry, err := Cache.Get(key)
	log.Debugf("• Getting key: %s (%s)", key, string(entry))

	if err != nil {
		log.Error(err)
		return "", err
	}
	return string(entry), err
}

// Set :: Shortcut function to Set value to a key in cache
func Set(key, value string) error {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	err := Cache.Set(key, []byte(value))
	log.Debugf("• Setting key: %s (%s)", key, value)

	if err != nil {
		log.Error(err)
		return err
	}
	return nil
}

// GetAll :: Shortcut function to Get all keys:values in cache
func GetAll() (*uint64, map[string]string, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	var t uint64
	keys := make(map[string]string)
	iterator := Cache.Iterator()

	for iterator.SetNext() {
		current, err := iterator.Value()
		if err == nil {
			keys[current.Key()] = string(current.Value())
			t = current.Timestamp()
		} else {
			log.Error(err)
			return nil, nil, err
		}
	}
	return &t, keys, nil
}
