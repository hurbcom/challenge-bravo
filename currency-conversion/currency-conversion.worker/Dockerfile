#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["currency-conversion.worker/currency-conversion.worker.csproj", "currency-conversion.worker/"]
RUN dotnet restore "currency-conversion.worker/currency-conversion.worker.csproj"
COPY . .
WORKDIR "/src/currency-conversion.worker"
RUN dotnet build "currency-conversion.worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "currency-conversion.worker.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "currency-conversion.worker.dll"]