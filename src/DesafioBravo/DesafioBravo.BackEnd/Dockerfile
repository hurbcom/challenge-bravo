FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS base
WORKDIR /app
EXPOSE 80

# ENV ASPNETCORE_URLS=http://+:80



FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src
COPY ["DesafioBravo.BackEnd.csproj", "./"]
RUN dotnet restore "DesafioBravo.BackEnd.csproj"
RUN dotnet tool install --global dotnet-ef --version 5.0.17
RUN dotnet tool install -g nbgv
ENV PATH="/root/.dotnet/tools:${PATH}"	

COPY . .
WORKDIR "/src/."
RUN dotnet build "DesafioBravo.BackEnd.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DesafioBravo.BackEnd.csproj" -c Release -o /app/publish /p:UseAppHost=false

RUN dotnet ef migrations add InitialMigrationMoedaHurb   
RUN dotnet ef database update

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DesafioBravo.BackEnd.dll"]

