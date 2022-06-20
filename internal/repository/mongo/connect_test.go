package mongo

import (
	"context"
	"github.com/joho/godotenv"
	"os"
	"testing"
)

func init() {
	err := godotenv.Load("../../../test/test.env")
	if err != nil {
		panic(err)
	}
}

func TestConnect(t *testing.T) {
	type args struct {
		name    string
		uri     string
		wantErr bool
	}
	tests := []args{
		{name: "connect with success", uri: os.Getenv("MONGO_URI"), wantErr: false},
		{name: "problem in url", uri: "", wantErr: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client, err := connect(context.Background(), tt.uri)
			if err != nil && !tt.wantErr {
				t.Fail()
			}
			if client == nil && !tt.wantErr {
				t.Fail()
			}
		})
	}

}
