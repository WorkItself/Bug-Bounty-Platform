FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Bug-Bounty-Platform.Domain/*.csproj Bug-Bounty-Platform.Domain/
COPY Bug-Bounty-Platform.DataAccess/*.csproj Bug-Bounty-Platform.DataAccess/
COPY Bug-Bounty-Platform.BusinessLogic/*.csproj Bug-Bounty-Platform.BusinessLogic/
COPY Bug-Bounty-Platform.Api/*.csproj Bug-Bounty-Platform.Api/

RUN dotnet restore Bug-Bounty-Platform.Api/Bug-Bounty-Platform.Api.csproj

COPY . .
WORKDIR /src/Bug-Bounty-Platform.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Bug-Bounty-Platform.Api.dll"]
