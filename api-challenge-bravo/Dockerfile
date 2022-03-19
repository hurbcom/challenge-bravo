FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["api-challenge-bravo/api-challenge-bravo.csproj", "api-challenge-bravo/"]
COPY ["tests-challenge-bravo/tests-challenge-bravo.csproj", "tests-challenge-bravo/"]
RUN dotnet restore "api-challenge-bravo/api-challenge-bravo.csproj"
COPY . .
RUN dotnet test
WORKDIR "/src/api-challenge-bravo"
RUN dotnet build "api-challenge-bravo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "api-challenge-bravo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "api-challenge-bravo.dll"]
