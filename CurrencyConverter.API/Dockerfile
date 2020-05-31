FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS build
WORKDIR /src
COPY ["CurrencyConverter.API/CurrencyConverter.API.csproj", "CurrencyConverter.API/"]
COPY ["CurrencyConverter.Service/CurrencyConverter.Service.csproj", "CurrencyConverter.Service/"]
COPY ["CurrencyConverter.Infrasctructure/CurrencyConverter.Infrasctructure.csproj", "CurrencyConverter.Infrasctructure/"]
COPY ["CurrencyConverter.Domain/CurrencyConverter.Domain.csproj", "CurrencyConverter.Domain/"]
RUN dotnet restore "CurrencyConverter.API/CurrencyConverter.API.csproj"
COPY . .
WORKDIR "/src/CurrencyConverter.API"
RUN dotnet build "CurrencyConverter.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CurrencyConverter.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.API.dll"]
