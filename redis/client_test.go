package redis

import (
	"fmt"
	"schonmann/challenge-bravo/currency"
	"testing"
)

func TestPubSub(t *testing.T) {
	pubSub, errSub := PSubscribe(CurrencyQuotaKey("*"))
	if errSub != nil {
		t.Fail()
	}
	errPub := Publish(CurrencyQuotaKey(currency.EUR), 3.141519)
	if errPub != nil {
		t.Fail()
	}
	for update := range pubSub.Channel() {
		fmt.Printf("New quota => Coin: %v, Value: %v\n", update.Channel, update.Payload)
		break
	}
}
