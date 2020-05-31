cls
Write-Host "`n`n --- Script de preparação para Currency Converter api em container ---`n" -ForegroundColor Green

Write-Host "`n Testando docker presente...`n" -ForegroundColor Green

docker version

Write-Host "`n Removendo containers previamente subidos`n" -ForegroundColor Green

docker-compose down

Write-Host "`n Fazendo build dos novos containers`n" -ForegroundColor Green

docker-compose build

Write-Host "`n Subindo novos containers`n" -ForegroundColor Green

docker-compose up -d

Write-Host "`n Containers estão no docker, verificando imagens`n" -ForegroundColor Green

docker-compose images

docker-compose ps

Write-Host "`n Aguardando 30 segundos para iniciar API (banco subindo primeiro)" -ForegroundColor Green

sleep 10

Write-Host "`n 20 segundos faltando..." -ForegroundColor DarkGreen

sleep 10

Write-Host "`n 10 segundos faltando..." -ForegroundColor DarkGreen

sleep 10

docker-compose up -d

Write-Host "Endereço da API: http://localhost:8090/diagnostics`n" -ForegroundColor Cyan
 
docker logs -f CurrencyConverter