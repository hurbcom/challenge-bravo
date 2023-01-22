FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Cuco.Cron/Cuco.Cron.csproj", "Cuco.Cron/"]
RUN dotnet restore "Cuco.Cron/Cuco.Cron.csproj"
COPY . .
WORKDIR "/src/Cuco.Cron"
RUN dotnet build "Cuco.Cron.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Cuco.Cron.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Cuco.Cron.dll"]
