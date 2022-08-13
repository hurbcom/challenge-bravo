FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
ENV ASPNETCORE_URLS=http://*:5000
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CurrencyConverterAPI/CurrencyConverterAPI.csproj", "CurrencyConverterAPI/"]
COPY ["CurrencyConverterAPITests/CurrencyConverterAPITests.csproj", "CurrencyConverterAPITests/"]
RUN dotnet restore "CurrencyConverterAPITests/CurrencyConverterAPITests.csproj"
RUN dotnet restore "CurrencyConverterAPI/CurrencyConverterAPI.csproj"
COPY . .
RUN dotnet test "CurrencyConverterAPITests/CurrencyConverterAPITests.csproj" --logger "trx;LogFileName=currencyconverter.trx"
RUN dotnet build "CurrencyConverterAPI/CurrencyConverterAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CurrencyConverterAPI/CurrencyConverterAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
RUN apt-get update && apt-get install curl -y
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CurrencyConverterAPI.dll"]