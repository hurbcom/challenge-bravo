package cache

import (
	"errors"
	"fmt"
	"strconv"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestCache(t *testing.T) {
	assert := assert.New(t)

	for index, tc := range []struct {
		cacheFor  time.Duration
		testCache func(*Store[string, any]) error
	}{
		{
			0,
			func(s *Store[string, any]) error {
				s.Set("foo", 1)
				v, ok := s.Get("foo")
				if !ok {
					return errors.New("key foo not found in store")
				}

				if v != 1 {
					return fmt.Errorf("expected foo value to be 1 but got %v instead", 1)
				}

				s.Delete("foo")

				_, ok = s.Get("foo")

				if ok {
					return errors.New("key foo found in store")
				}

				return nil
			},
		},
		{
			0,
			func(s *Store[string, any]) error {
				wg := new(sync.WaitGroup)
				resultChan := make(chan [3]any, 10)
				wg.Add(10)
				for i := 0; i < 10; i++ {
					go func(i int) {
						defer wg.Done()
						s.Set(strconv.Itoa(i), i)
					}(i)
				}
				wg.Wait()

				wg.Add(10)
				for i := 0; i < 10; i++ {
					go func(i int) {
						defer wg.Done()
						v, ok := s.Get(strconv.Itoa(i))
						resultChan <- [3]any{v, ok, i}
					}(i)
				}
				wg.Wait()
				close(resultChan)

				for a := range resultChan {
					v := a[0]
					ok := a[1].(bool)
					i := a[2].(int)

					if !ok {
						return fmt.Errorf("key %d not found", i)
					}

					if v != i {
						return fmt.Errorf("expected foo value to be %d but got %v instead", i, v)
					}
				}

				return nil
			},
		},
		{
			50 * time.Millisecond,
			func(s *Store[string, any]) error {
				s.Set("foo", 1)
				time.Sleep(80 * time.Millisecond)
				_, ok := s.Get("foo")
				if ok {
					return errors.New("key foo found in store")
				}
				return nil
			},
		},
		{
			50 * time.Millisecond,
			func(s *Store[string, any]) error {
				s.Set("foo", 1)
				s.Set("foo", 1)
				time.Sleep(80 * time.Millisecond)
				_, ok := s.Get("foo")
				if ok {
					return errors.New("key foo found in store")
				}
				return nil
			},
		},
	} {
		s := NewStore[string, any](tc.cacheFor)
		err := tc.testCache(s)
		assert.NoError(err, fmt.Sprintf("error at index %d", index))
	}
}
