FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
ENV ASPNETCORE_URLS=http://*:5000
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CurrencyConverterAPI/CurrencyConverterAPI.csproj", "CurrencyConverterAPI/"]
RUN dotnet restore "CurrencyConverterAPI/CurrencyConverterAPI.csproj"
COPY . .
WORKDIR "/src/CurrencyConverterAPI"
RUN dotnet build "CurrencyConverterAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CurrencyConverterAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
RUN apt-get update && apt-get install curl -y
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverterAPI.dll"]