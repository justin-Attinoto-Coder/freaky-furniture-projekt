# Update Azure SQL Connection String
# Run this after getting your connection string from Azure

param(
    [Parameter(Mandatory=$true)]
    [string]$ConnectionString
)

# Path to the production appsettings
$appsettingsPath = "FreakyFurnitureAPI\appsettings.Production.json"

# Read the current content
$content = Get-Content $appsettingsPath -Raw | ConvertFrom-Json

# Update the connection string
$content.ConnectionStrings.DefaultConnection = $ConnectionString

# Write back to file
$content | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath

Write-Host "Connection string updated successfully!"
Write-Host "New connection string: $ConnectionString"