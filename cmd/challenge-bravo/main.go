package main

import (
	"log"
	"os"
	"strconv"

	"github.com/ElladanTasartir/challenge-bravo/internal/infra/cache"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/http"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/storage"
)

func main() {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		log.Fatalf("Port is not a number %d", port)
	}

	storageClient := storage.Connect(os.Getenv("MONGODB_HOST"), os.Getenv("MONGODB_DATABASE"))
	defer storageClient.Disconnect()

	cacheClient := cache.Connect(os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PASSWORD"))
	defer cacheClient.Disconnect()

	http.Run(&http.ServerConfig{
		Port:        port,
		Environment: os.Getenv("ENVIRONMENT"),
	}, storageClient, cacheClient)
}
