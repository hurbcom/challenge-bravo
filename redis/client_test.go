package redis

import (
	"fmt"
	"strconv"
	"testing"
)

func TestMGetMSet(t *testing.T) {
	_, err := MSet("martino", 9, "metheny", 10)
	if err != nil {
		t.Fail()
	}
	vals, err := MGet("martino", "metheny")
	if err != nil {
		t.Fail()
	}
	for _, v := range vals {
		fl, err := strconv.ParseFloat(v.(string), 64)
		if err != nil {
			t.Fail()
		}
		fmt.Println(fl + 1)
	}
}
