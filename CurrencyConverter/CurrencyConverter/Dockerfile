#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["CurrencyConverter/CurrencyConverter.csproj", "CurrencyConverter/"]
RUN dotnet restore "CurrencyConverter/CurrencyConverter.csproj"
COPY . .
WORKDIR "/src/CurrencyConverter"
RUN dotnet build "CurrencyConverter.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CurrencyConverter.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]