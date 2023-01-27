FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS test
WORKDIR /src
COPY ["Cuco.API/Cuco.API.csproj", "Cuco.API/"]
COPY ["Cuco.IoC/Cuco.IoC.csproj", "Cuco.IoC/"]
COPY ["Cuco.Application/Cuco.Application.csproj", "Cuco.Application/"]
COPY ["Cuco.Domain/Cuco.Domain.csproj", "Cuco.Domain/"]
COPY ["Cuco.Commons/Cuco.Commons.csproj", "Cuco.Commons/"]
COPY ["Cuco.Infra/Cuco.Infra.csproj", "Cuco.Infra/"]
COPY ["Cuco.Application.Tests/Cuco.Application.Tests.csproj", "Cuco.Application.Tests/"]
COPY ["Cuco.Infra.Tests/Cuco.Infra.Tests.csproj", "Cuco.Infra.Tests/"]
RUN dotnet restore "Cuco.API/Cuco.API.csproj"
RUN dotnet restore "Cuco.Infra.Tests/Cuco.Infra.Tests.csproj"
RUN dotnet restore "Cuco.Application.Tests/Cuco.Application.Tests.csproj"
COPY . .
WORKDIR "/src/Cuco.Application.Tests"
RUN dotnet test "Cuco.Application.Tests.csproj"
WORKDIR "/src/Cuco.Infra.Tests"
RUN dotnet test "Cuco.Infra.Tests.csproj"

FROM test AS build
WORKDIR "/src/Cuco.API"
RUN dotnet build "Cuco.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Cuco.API.csproj" -c Release -o /app/publish



FROM base AS final

WORKDIR /app
RUN apt-get update && apt-get install curl -y
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Cuco.API.dll"]
