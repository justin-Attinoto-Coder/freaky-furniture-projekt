# Freaky Furniture - Render.com Deployment Guide

This guide explains how to deploy the Freaky Furniture application to Render.com.

## Prerequisites

1. **Render.com Account**: Sign up at [render.com](https://render.com)
2. **Azure SQL Database**: Since Render.com doesn't support SQL Server, we'll use Azure SQL Database

## Database Setup (Azure SQL Database)

### Option 1: Automated Setup (Recommended)

1. **Install Azure CLI**:
   - Download from: [Microsoft Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows)
   - Or install via Chocolatey: `choco install azure-cli`

2. **Run the setup script**:

   ```powershell
   # Open PowerShell as Administrator
   cd "C:\Workspace\JavaScript3-angular\freaky-furniture-projekt"
   .\setup-azure-sql.ps1
   ```

3. **Copy the connection string** from the output and update `appsettings.Production.json`

   Or use the automated script:

   ```powershell
   .\update-connection-string.ps1 -ConnectionString "your-full-connection-string-here"
   ```

### Option 2: Manual Setup via Azure Portal

1. **Create Azure SQL Database**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Search for "SQL Database" and click "Create"
   - **Basics**:
     - Subscription: Your subscription
     - Resource group: Create new "freaky-furniture-rg" or use existing
     - Database name: `FreakyFurnitureDB`
     - Server: Create new
       - Server name: `freaky-furniture-sql` (must be globally unique)
       - Location: East US (or your preferred region)
       - Authentication: Use SQL authentication
       - Server admin login: `freakyadmin`
       - Password: Choose a strong password
     - **Compute + storage**: Choose "Free" tier
   - Click "Review + create" then "Create"

2. **Configure Firewall**:
   - After creation, go to your SQL server resource
   - Under "Security" > "Networking"
   - Add firewall rule: Allow all Azure services (0.0.0.0 - 0.0.0.0)

3. **Get Connection String**:
   - In your SQL Database resource, go to "Connection strings"
   - Copy the "ADO.NET" connection string
   - Replace `{your_password}` with your actual password

## Deployment Steps

### 1. Backend API Deployment

1. **Fork/Clone this repository** to your GitHub account
2. **Go to Render.com Dashboard**
3. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the `render-deployment` branch
   - Choose "Docker" as runtime
   - Set build command: `docker build -t freaky-furniture-api .`
   - Set start command: `docker run -p $PORT:80 freaky-furniture-api`
4. **Environment Variables**:
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `ASPNETCORE_URLS`: `http://+:$PORT`
   - `ConnectionStrings__DefaultConnection`: Your Azure SQL connection string
   - `JwtSettings__SecretKey`: Generate a secure random string (32+ characters)

### 2. Frontend Deployment

1. **Create New Static Site** in Render.com:
   - Connect the same GitHub repository
   - Select the `render-deployment` branch
   - Set build command: `cd client && npm install && npm run build --prod`
   - Set publish directory: `./client/dist/client`
2. **Environment Variables**:
   - `API_BASE_URL`: Your deployed API URL (e.g., `https://freaky-furniture-api.onrender.com`)

### 3. Database Migration

After deploying the API, you need to run the database migrations:

1. **Connect to your deployed API**
2. **Run migrations** (you can do this via SSH if needed, or create a temporary endpoint)

## Configuration Files

The deployment branch includes:

- `Dockerfile`: For containerizing the ASP.NET Core API
- `render.yaml`: Render deployment configuration
- `appsettings.Production.json`: Production configuration
- `client/src/environments/`: Environment-specific configurations

## Important Notes

- **Database**: Azure SQL Database is used instead of local SQL Server
- **CORS**: Update CORS settings in `Program.cs` if needed for production domains
- **Environment Variables**: All sensitive data is configured via environment variables
- **SSL**: Render.com provides automatic SSL certificates

## Troubleshooting

1. **Database Connection Issues**:
   - Ensure Azure SQL firewall allows Render.com IPs
   - Verify connection string format

2. **API Not Starting**:
   - Check environment variables are set correctly
   - Review Docker build logs

3. **Frontend Not Loading**:
   - Verify API_BASE_URL is correct
   - Check browser console for CORS errors

## Cost Estimation

- **Render.com Free Tier**: 750 hours/month free
- **Azure SQL Database Free Tier**: 250GB storage, limited DTUs
- **Total Estimated Cost**: ~$0-5/month for light usage

## Post-Deployment

1. **Test the application** thoroughly
2. **Update DNS** if using custom domain
3. **Monitor logs** in Render.com dashboard
4. **Set up backups** for the database

## Security Considerations

- Use strong passwords for database
- Keep JWT secrets secure
- Regularly update dependencies
- Monitor for security vulnerabilities
