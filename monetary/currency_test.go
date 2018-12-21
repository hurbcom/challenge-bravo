package monetary

import (
	"testing"
)

func Test_parseRawQuota(t *testing.T) {
	var raw1, raw2, raw3 interface{}
	raw1, raw2, raw3 = "3.141519", "8.123678234", "-9.194012"

	float1, err := parseRawQuota(raw1)
	if err != nil || float1 != 3.141519 {
		t.Fail()
	}

	float2, err := parseRawQuota(raw2)
	if err != nil || float2 != 8.123678234 {
		t.Fail()
	}

	float3, err := parseRawQuota(raw3)
	if err != nil || float3 != -9.194012 {
		t.Fail()
	}
}

func Test_calculateConversion(t *testing.T) {
	amount, from, to := 1340.14, 1.00, 3.141519
	expected := 4210.07527266

	result := calculateConversion(amount, from, to)

	if expected != result {
		t.Fail()
	}
}
