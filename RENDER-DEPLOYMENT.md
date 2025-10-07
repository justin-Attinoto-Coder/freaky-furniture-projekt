# Freaky Furniture - Render.com Deploym**Connection String Format:**

```sql
Host=nckapfsfgyljjkotvbyv.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-service-role-key;SSL Mode=Require;Trust Server Certificate=true
```

**Important Notes:**

- **IP Restrictions**: Supabase may block connections from unknown IPs. You might need to:
  - Add your current IP to Supabase allowlist, OR
  - Use Supabase connection pooling (recommended for production)
  - Configure this after deployment on Render.com

- **Connection Pooling**: For production, consider using Supabase's connection pooling:
  - Go to Settings → Database → Connection Pooling
  - Use the pooled connection string insteaduide
**Why Azure?**

- ✅ **Free tier available** but requires Azure subscription
- ✅ **SQL Server compatible** (no code changes needed)
- ✅ **Enterprise features** if you scale up

**Setup:** Follow the automated script method below after creating an Azure account.

### 🐘 Option 3: Other Free PostgreSQL Services

- **Neon**: Serverless PostgreSQL (512MB free)
- **Railway**: PostgreSQL with 512MB free
- **ElephantSQL**: PostgreSQL as a service (20MB-5GB free tiers) explains how to deploy the Freaky Furniture application to Render.com.

## Prerequisites

1. **Render.com Account**: Sign up at [render.com](https://render.com)
2. **Database**: Choose from the options below (Supabase recommended for no-subscription setup)

## Database Setup (Choose Your Option)

### 🆓 Option 1: Supabase (Recommended - No Subscription Required)

**Why Supabase?**

- ✅ **Free tier**: 500MB database, 50MB file storage, 2GB bandwidth
- ✅ **No credit card required** to get started
- ✅ **PostgreSQL** (works great with Entity Framework)
- ✅ **Built-in features**: Authentication, real-time subscriptions, edge functions
- ✅ **Easy setup**: Web-based dashboard

**Quick Setup:**

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Get your connection string from Settings → Database
4. Update `appsettings.Production.json` with the Supabase connection string

**Connection String Format:**

```sql
Host=your-project-ref.supabase.co;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require;Trust Server Certificate=true
```

### ☁️ Option 2: Azure SQL Database (Requires Subscription)

**Why Azure?**

- ✅ **Free tier available** but requires Azure subscription
- ✅ **SQL Server compatible** (no code changes needed)
- ✅ **Enterprise features** if you scale up

**Setup:** Follow the automated script method below after creating an Azure account.

### 🐘 Option 3: Other Free PostgreSQL Services

- **Neon**: Serverless PostgreSQL (512MB free)
- **Railway**: PostgreSQL with 512MB free
- **ElephantSQL**: PostgreSQL as a service (20MB-5GB free tiers)

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
