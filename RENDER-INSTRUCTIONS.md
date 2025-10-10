# Render.com Deployment Instructions

## Backend API Service

**Service Name:** freaky-furniture-api-backend  
**Service Type:** Web Service  
**Runtime:** Docker  
**Repository:** [https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt](https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt)  

**Branch:** render-deployment  

### Build Settings

- **Build Command:** Leave EMPTY (Render will use Dockerfile automatically)
- **Start Command:** Leave EMPTY (Render will use Dockerfile ENTRYPOINT)

### Environment Variables

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=<http://0.0.0.0:$PORT>
ConnectionStrings__DefaultConnection=Host=nckapfsfgyljjkotvbyv.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=pS3Ag7VoLzn2Yrfc;SSL Mode=Require;Trust Server Certificate=true
JwtSettings__SecretKey=supersecretkey12345678901234567890123456789012345

## Frontend Static Site

**Service Name:** freaky-furniture-webapp  
**Service Type:** Static Site  
**Repository:** [https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt](https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt)  
**Branch:** render-deployment  

- **Build Command:** `cd client && npm ci && npm run build`
- **Publish Directory:** `client/dist/client/browser`

NODE_VERSION=18

## Steps to Deploy

1. **Create API Service:**
   - Go to Render Dashboard → New Web Service
   - Connect GitHub repo, select render-deployment branch
   - Choose "Docker" runtime
   - Leave build/start commands EMPTY
   - Add environment variables above
   - Deploy

2. **Create Frontend Service:**
   - Go to Render Dashboard → New Static Site
   - Connect same GitHub repo, render-deployment branch  
   - Set build command and publish directory as above
   - Add NODE_VERSION environment variable
   - Deploy

3. **Update Frontend API URL:**
   - After API deploys, note the URL (should be: [https://freaky-furniture-api-backend.onrender.com](https://freaky-furniture-api-backend.onrender.com))
   - The environment.prod.ts is already configured for the new service name
   - Frontend will automatically connect to the correct API URL

## Current Deployment Status

### ✅ **API Service: freaky-furniture-projekt**
- **URL:** https://freaky-furniture-projekt.onrender.com
- **Status:** ✅ Live and responding
- **Database:** ⚠️ Needs environment variable update with correct password

### ✅ **Frontend Service: freaky-furniture-projekt-1** 
- **URL:** https://freaky-furniture-projekt-1.onrender.com
- **Status:** ✅ Live (after publish directory fix)
- **API Connection:** ⚠️ Still using localhost - needs redeploy after package.json fix

## 🚨 **CRITICAL NEXT STEPS:**

### 1. **Update API Environment Variables in Render Dashboard:**
```bash
ConnectionStrings__DefaultConnection=Host=newuouqyeaaoszzmqkej.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=@YTrGDnw!7VcxHc;SSL Mode=Require;Trust Server Certificate=true
JwtSettings__Issuer=FreakyFurnitureAPI
JwtSettings__Audience=FreakyFurnitureClients
```

### 2. **Redeploy API Service**
- This will trigger `Database.EnsureCreated()` and create all furniture tables
- Tables created: Products, Categories, Cart, Users, Reviews, PaymentDetails, ShippingDetails

### 3. **Redeploy Frontend Service** 
- This will use the production configuration to connect to the correct API URL
- Frontend will stop trying to connect to localhost

## Expected Final Result:
- ✅ **API:** Creates furniture tables, seeds sample data, serves products
- ✅ **Frontend:** Connects to production API, displays furniture store
- ✅ **Database:** Contains both movies (existing) + furniture tables (new)

## Troubleshooting

If you get "docker: command not found":
- Make sure you selected "Docker" as runtime for the API service
- Ensure build and start commands are LEFT EMPTY for Docker services  
- Render will automatically detect and use your Dockerfile

If API returns empty products:
- Check Render logs for database connection errors
- Verify environment variables are set correctly
- Ensure Supabase project is active (not paused)
  