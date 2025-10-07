# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["FreakyFurnitureAPI/FreakyFurnitureAPI.csproj", "FreakyFurnitureAPI/"]
RUN dotnet restore "FreakyFurnitureAPI/FreakyFurnitureAPI.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/FreakyFurnitureAPI"
RUN dotnet build "FreakyFurnitureAPI.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "FreakyFurnitureAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80
EXPOSE 80

# Set the entry point
ENTRYPOINT ["dotnet", "FreakyFurnitureAPI.dll"]