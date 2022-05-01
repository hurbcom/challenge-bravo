#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["currency-conversion.web/currency-conversion.web.csproj", "currency-conversion.web/"]
COPY ["currency-conversion.Core/currency-conversion.core.csproj", "currency-conversion.Core/"]
COPY ["currency-conversion.infrastructure/currency-conversion.infrastructure.csproj", "currency-conversion.infrastructure/"]
RUN dotnet restore "currency-conversion.web/currency-conversion.web.csproj"
COPY . .
WORKDIR "/src/currency-conversion.web"
RUN dotnet build "currency-conversion.web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "currency-conversion.web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "currency-conversion.web.dll"]
