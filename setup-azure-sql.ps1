# Azure SQL Database Setup Script for Freaky Furniture
# Run this in PowerShell after installing Azure CLI

# Login to Azure (will open browser)
az login

# Set subscription (if you have multiple)
# az account set --subscription "your-subscription-name"

# Create a resource group (optional, you can use existing)
az group create --name "freaky-furniture-rg" --location "East US"

# Create SQL Server
az sql server create `
  --name "freaky-furniture-sql" `
  --resource-group "freaky-furniture-rg" `
  --location "East US" `
  --admin-user "freakyadmin" `
  --admin-password "YourSecurePassword123!" `
  --enable-public-network true

# Create SQL Database (Free tier)
az sql db create `
  --resource-group "freaky-furniture-rg" `
  --server "freaky-furniture-sql" `
  --name "FreakyFurnitureDB" `
  --edition "Free" `
  --max-size "250MB"

# Configure firewall to allow Azure services
az sql server firewall-rule create `
  --resource-group "freaky-furniture-rg" `
  --server "freaky-furniture-sql" `
  --name "AllowAllAzureIPs" `
  --start-ip-address "0.0.0.0" `
  --end-ip-address "0.0.0.0"

# Get connection string
az sql db show-connection-string `
  --client "ado.net" `
  --server "freaky-furniture-sql" `
  --name "FreakyFurnitureDB"