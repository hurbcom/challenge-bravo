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
	sync.Mutex
	entries map[currency]cacheEntry
}

const (
	cacheTimeout time.Duration = 15 * time.Minute
)

func (ce cacheEntries) isValid(c currency) bool {
	ce.Lock()
	e, ok := ce.entries[c]
	ce.Unlock()
	return ok && e.timestamp.Add(cacheTimeout).After(time.Now())
}

func (ce cacheEntries) updateCacheEntry(c currency) bool {
	if ce.isValid(c) {
		return true
	}
	q, ok := fetchQuote(c)
	if !ok {
		return false
	}
	ce.Lock()
	ce.entries[c] = cacheEntry{
		q,
		time.Now(),
	}
	ce.Unlock()
	return true
}

func (ce cacheEntries) Quote(c currency) (q float64, ok bool) {
	if ok = ce.updateCacheEntry(c); !ok {
		return
	}
	ce.Lock()
	q = ce.entries[c].quote
	ce.Unlock()
	return
}

var quotesCache = cacheEntries{
	sync.Mutex{},
	make(map[currency]cacheEntry),
}
