# Render.com Deployment Instructions

## Backend API Service

**Service Type:** Web Service  
**Runtime:** Docker  
**Repository:** https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt  
**Branch:** render-deployment  

### Build Settings:
- **Build Command:** Leave EMPTY (Render will use Dockerfile automatically)
- **Start Command:** Leave EMPTY (Render will use Dockerfile ENTRYPOINT)

### Environment Variables:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT
ConnectionStrings__DefaultConnection=Host=nckapfsfgyljjkotvbyv.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ja2FwZnNmZ3lsamprb3R2Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI5MDgwNCwiZXhwIjoyMDczODY2ODA0fQ.Jui9v92DQWytq14O1P7nZW-hjLW55eJ15-FNqHmw9V0;SSL Mode=Require;Trust Server Certificate=true
JwtSettings__SecretKey=supersecretkey12345678901234567890123456789012345
```

## Frontend Static Site

**Service Type:** Static Site  
**Repository:** https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt  
**Branch:** render-deployment  

### Build Settings:
- **Build Command:** `cd client && npm ci && npm run build --configuration production`
- **Publish Directory:** `client/dist/client`

### Environment Variables:
```
NODE_VERSION=18
```

## Steps to Deploy:

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
   - After API deploys, note the URL (e.g., https://freaky-furniture-api-xyz.onrender.com)
   - Update client/src/environments/environment.prod.ts with actual API URL
   - Redeploy frontend

## Troubleshooting:

If you get "docker: command not found":
- Make sure you selected "Docker" as runtime for the API service
- Ensure build and start commands are LEFT EMPTY for Docker services
- Render will automatically detect and use your Dockerfile