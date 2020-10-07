## Desafio Bravo
### Responding to the challenge

First run:
```
make build
```
Other executions:
```
make run
```
Stopping the application:
```
make stop
```
Running unit tests:    
```
make unittest
```
Running stress test:    
```
make stresstest-build
make stresstest-run
(with the server running)
```
Add new currency:
```
curl --request POST \
  --url http://localhost/api/v1/currencies \
  --header 'content-type: application/json' \
  --data '{"currency":"BRL"}'
```
Remove existing currency:
```
curl --request DELETE \
  --url http://localhost/api/v1/currencies/BRL \
  --header 'content-type: application/json' 
```
And last but not least: exchange value...
```
curl --request GET \
  --url 'http://localhost/api/v1/exchanges?from=USD&to=BRL&amount=123.45' \
  --header 'cache-control: no-cache' 
```