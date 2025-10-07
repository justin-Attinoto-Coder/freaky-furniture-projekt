# Freaky Furniture - Render.com Deployment Guide

This guide explains how to deploy the Freaky Furniture application to Render.com.

## Prerequisites

1. **Render.com Account**: Sign up at [render.com](https://render.com)
2. **Azure SQL Database**: Since Render.com doesn't support SQL Server, we'll use Azure SQL Database

## Database Setup (Azure SQL Database)

1. **Create Azure SQL Database**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "SQL Database" resource
   - Choose "Free" tier for development
   - Note down the server name, database name, admin username, and password

2. **Configure Firewall**:
   - In Azure Portal, go to your SQL server
   - Under "Security" > "Networking"
   - Add your IP address to allow connections
   - For production, you may need to allow all Azure services

3. **Get Connection String**:
   - The connection string format should be:

   ```sql
   Server=tcp:your-server.database.windows.net,1433;Initial Catalog=your-database;Persist Security Info=False;User ID=your-admin-user;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
   ```

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
