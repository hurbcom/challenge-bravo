FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["ConversionAPI/ConversionAPI.csproj", "ConversionAPI/"]
RUN dotnet restore "ConversionAPI/ConversionAPI.csproj"
COPY . .
WORKDIR "/src/ConversionAPI"
RUN dotnet build "ConversionAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ConversionAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ConversionAPI.dll"]