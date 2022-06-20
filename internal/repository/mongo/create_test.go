package mongo

import (
	"context"
	"github.com/joho/godotenv"
	"testing"
)

func init() {
	err := godotenv.Load("../../../test/test.env")
	if err != nil {
		panic(err)
	}
}

func TestEngine_Create(t *testing.T) {
	type args struct {
		name    string
		data    interface{}
		wantErr bool
	}
	tests := []args{
		{name: "create with success", data: map[string]interface{}{"name": "test"}, wantErr: false},
		{name: "not create string", data: "test", wantErr: true},
	}
	engine, err := NewEngine(context.Background())
	if err != nil {
		t.Fail()
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := engine.Create(context.Background(), tt.data)
			if err != nil && !tt.wantErr {
				t.Fail()
			}
			if result == nil && !tt.wantErr {
				t.Fail()
			}
		})

	}
}
