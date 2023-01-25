FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR "/src"
COPY ["Cuco.Sync.Cron.csproj", "."]
RUN dotnet restore "Cuco.Sync.Cron.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "Cuco.Sync.Cron.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Cuco.Sync.Cron.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Cuco.Sync.Cron.dll"]
