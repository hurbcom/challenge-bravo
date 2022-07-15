package cache

import (
	"sync"
	"time"
)

// NewStore creates a new Store.
// cacheFor is the amount of time the value will be cached, set to 0 to cache forever.
func NewStore[K comparable, V any](cacheFor time.Duration) *Store[K, V] {
	return &Store[K, V]{
		cache:    make(map[K]V),
		cacheFor: cacheFor,
		cancels:  make(map[K]chan struct{}),
	}
}

// Store is a simple Key/Value thread safe cache.
type Store[K comparable, V any] struct {
	locker   sync.RWMutex
	cache    map[K]V
	cacheFor time.Duration
	cancels  map[K]chan struct{}
}

// Set sets a new value to the store cache.
func (s *Store[K, V]) Set(k K, v V) {
	s.locker.Lock()
	defer s.locker.Unlock()

	if cancel, ok := s.cancels[k]; ok {
		cancel <- struct{}{}
	}

	s.cache[k] = v
	if s.cacheFor == 0 {
		return
	}

	done := make(chan struct{})
	s.cancels[k] = done

	go func() {
		select {
		case <-time.After(s.cacheFor):
			s.Delete(k)
		case <-done:
			return
		}
	}()
}

// Get returns the value in the store cache of
// the passed key and if it was found or not.
func (s *Store[K, V]) Get(k K) (V, bool) {
	s.locker.RLock()
	defer s.locker.RUnlock()
	v, ok := s.cache[k]
	return v, ok
}

// Delete deletes an entry from the store cache.
func (s *Store[K, V]) Delete(k K) {
	s.locker.Lock()
	defer s.locker.Unlock()
	delete(s.cache, k)
}
