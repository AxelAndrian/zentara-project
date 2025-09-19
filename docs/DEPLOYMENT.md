# Deployment Guide

## Overview

This guide covers deploying Zentara Global Cyber Threat Monitor to various platforms and environments.

## Prerequisites

### Required Environment Variables
```env
NIM_API_KEY=your_nvidia_nim_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and optimizations.

#### Setup Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Navigate to Settings > Environment Variables
   - Add `NIM_API_KEY` and other required variables

3. **Configure Build Settings**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

4. **Custom Domain (Optional)**
   - Add domain in Vercel Dashboard
   - Configure DNS records
   - Enable SSL automatically

#### Vercel Configuration

Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NIM_API_KEY": "@nim_api_key"
  }
}
```

### 2. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  zentara:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NIM_API_KEY=${NIM_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Build and Run
```bash
# Build the image
docker build -t zentara .

# Run the container
docker run -p 3000:3000 -e NIM_API_KEY=your_key zentara

# Or use docker-compose
docker-compose up -d
```

### 3. AWS Deployment

#### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Select the main branch

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

3. **Environment Variables**
   - Add `NIM_API_KEY` in Amplify Console
   - Configure build-time variables

#### AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Update system
   sudo yum update -y
   
   # Install Node.js
   curl -o- https://raw.githubusercontent.com/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18
   
   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/zentara.git
   cd zentara
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "zentara" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### 4. Google Cloud Platform

#### Cloud Run

1. **Create Dockerfile** (see Docker section above)

2. **Deploy to Cloud Run**
   ```bash
   # Build and push to Google Container Registry
   gcloud builds submit --tag gcr.io/PROJECT-ID/zentara
   
   # Deploy to Cloud Run
   gcloud run deploy zentara \
     --image gcr.io/PROJECT-ID/zentara \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NIM_API_KEY=your_key
   ```

#### App Engine

1. **Create app.yaml**
   ```yaml
   runtime: nodejs18
   
   env_variables:
     NIM_API_KEY: "your_nim_api_key"
     NODE_ENV: "production"
   
   automatic_scaling:
     min_instances: 1
     max_instances: 10
   ```

2. **Deploy**
   ```bash
   gcloud app deploy
   ```

### 5. Azure Deployment

#### Azure App Service

1. **Create App Service**
   ```bash
   # Create resource group
   az group create --name zentara-rg --location eastus
   
   # Create app service plan
   az appservice plan create --name zentara-plan --resource-group zentara-rg --sku B1
   
   # Create web app
   az webapp create --name zentara-app --resource-group zentara-rg --plan zentara-plan
   ```

2. **Configure Environment Variables**
   ```bash
   az webapp config appsettings set --name zentara-app --resource-group zentara-rg --settings NIM_API_KEY=your_key
   ```

3. **Deploy from GitHub**
   - Connect GitHub repository in Azure Portal
   - Enable continuous deployment
   - Configure build settings

## Environment Configuration

### Development
```env
NODE_ENV=development
NIM_API_KEY=your_dev_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG=true
```

### Staging
```env
NODE_ENV=production
NIM_API_KEY=your_staging_key
NEXT_PUBLIC_APP_URL=https://staging.zentara.com
NEXT_PUBLIC_DEBUG=false
```

### Production
```env
NODE_ENV=production
NIM_API_KEY=your_production_key
NEXT_PUBLIC_APP_URL=https://zentara.com
NEXT_PUBLIC_DEBUG=false
```

## Security Considerations

### 1. Environment Variables
- Never commit API keys to version control
- Use environment-specific configurations
- Rotate keys regularly

### 2. HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Enable HSTS headers

### 3. CORS
- Configure proper CORS policies
- Restrict allowed origins
- Use server-side proxy for external APIs

### 4. Rate Limiting
- Implement rate limiting for API endpoints
- Use CDN for static assets
- Monitor and alert on unusual traffic

## Monitoring and Logging

### 1. Application Monitoring
```typescript
// Add to your application
import { init } from '@sentry/nextjs';

init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Health Checks
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### 3. Logging
```typescript
// Use structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Performance Optimization

### 1. Build Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif']
  }
};
```

### 2. CDN Configuration
- Use CDN for static assets
- Configure proper caching headers
- Enable gzip compression

### 3. Database Optimization
- Use connection pooling
- Implement query optimization
- Add proper indexing

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Runtime Errors**
   - Verify environment variables
   - Check API key validity
   - Monitor application logs

3. **Performance Issues**
   - Enable production optimizations
   - Check bundle size
   - Monitor memory usage

### Debug Mode
```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG=true npm run dev

# Check build output
npm run build -- --debug

# Analyze bundle
npm run build && npx @next/bundle-analyzer
```

## Rollback Strategy

### 1. Blue-Green Deployment
- Maintain two identical environments
- Switch traffic between environments
- Instant rollback capability

### 2. Canary Deployment
- Deploy to small percentage of users
- Monitor metrics and errors
- Gradually increase traffic

### 3. Database Migrations
- Always backward compatible
- Test migrations in staging
- Have rollback scripts ready

## Backup and Recovery

### 1. Code Backup
- Use version control (Git)
- Tag releases
- Maintain multiple branches

### 2. Data Backup
- Regular database backups
- Test restore procedures
- Store backups securely

### 3. Configuration Backup
- Document all configurations
- Version control config files
- Maintain environment templates
