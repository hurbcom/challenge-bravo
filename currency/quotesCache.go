package currency

import (
	"sync"
	"time"
)

type cacheEntry struct {
	quote     float64
	timestamp time.Time
}

type cacheEntries struct {
	entries map[currency]cacheEntry
	mutex   sync.Mutex
}

const (
	CacheTimeout time.Duration = 15 * time.Minute
)

func (ce cacheEntries) isValid(c currency) bool {
	ce.mutex.Lock()
	e, ok := ce.entries[c]
	ce.mutex.Unlock()
	return ok && e.timestamp.Add(CacheTimeout).After(time.Now())
}

func (ce cacheEntries) updateCacheEntry(c currency) bool {
	if ce.isValid(c) {
		return true
	}
	q, ok := fetchQuote(c)
	if !ok {
		return false
	}
	ce.mutex.Lock()
	ce.entries[c] = cacheEntry{
		q,
		time.Now(),
	}
	ce.mutex.Unlock()
	return true
}

func (ce cacheEntries) Quote(c currency) (q float64, ok bool) {
	if ok = ce.updateCacheEntry(c); !ok {
		return
	}
	ce.mutex.Lock()
	q = ce.entries[c].quote
	ce.mutex.Unlock()
	return
}

var quotesCache cacheEntries = cacheEntries{
	make(map[currency]cacheEntry),
	sync.Mutex{},
}
