compose:
	docker-compose build
up:compose
	docker-compose up
down:
	docker-compose down
clean:
	./gradlew clean
test:clean
	./gradlew test
jar:test
	./gradlew bootJar
run:jar up
	java -jar ./build/libs/bravo.jar