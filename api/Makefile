# RUN ALL PROJECT TESTS
run-tests:
	mkdir -p ./test/cover
	go test -race -coverpkg= ./application/... -coverprofile=./test/cover/cover.out
	go tool cover -html=./test/cover/cover.out -o ./test/cover/cover.html

# GET ALL PROJECT DEPENDENCE
get-deps:
	go mod tidy
