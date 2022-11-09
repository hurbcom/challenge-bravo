test:
	go clean -testcache && go test ./...

ddosify-stress-case:
	 ddosify -t "http://localhost:8080/conversion?from=USD&to=BRL&amount=1" -n 1000 -d 1 -p HTTP -T 0
