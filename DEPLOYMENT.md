# Deployment Guide

## Production Deployment with Docker

### Prerequisites
- Docker and Docker Compose installed
- Domain name and SSL certificates
- Production MongoDB instance
- Production environment variables configured

### Step 1: Prepare Environment
1. Copy environment template:
```bash
cp .env.production.example .env.production
```

2. Edit `.env.production` with your production values:
- Set strong JWT secrets
- Configure production MongoDB URI
- Set your domain for CORS_ORIGIN
- Configure email settings
- Set up SSL certificate paths

### Step 2: SSL Certificates
1. Create SSL directory:
```bash
mkdir -p ssl
```

2. Place your SSL certificates:
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

### Step 3: Deploy with Docker Compose
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 4: Initialize Database
The MongoDB init script will automatically create the database and default admin user.

Default admin credentials:
- Email: admin@tozsolutions.com
- Password: admin123

**Important**: Change these credentials immediately after first login.

### Step 5: Health Checks
Test your deployment:
```bash
# Health check
curl https://yourdomain.com/health

# API test
curl https://yourdomain.com/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tozsolutions.com","password":"admin123"}'
```

## Manual Deployment

### Backend Deployment
1. Clone repository on server
2. Install Node.js 18+
3. Set up production environment variables
4. Install dependencies and build:
```bash
cd server
npm ci --only=production
npm run build
```
5. Start with PM2:
```bash
npm install -g pm2
pm2 start dist/index.js --name "web-toz-server"
pm2 startup
pm2 save
```

### Frontend Deployment
1. Build the application:
```bash
cd client
npm ci
npm run build
```
2. Serve with Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/client/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Maintenance

### Log Management
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs server
docker-compose -f docker-compose.prod.yml logs client

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Backup
```bash
# Backup MongoDB
docker exec web_toz_mongo_prod mongodump --archive=/backup/backup-$(date +%Y%m%d).gz --gzip

# Restore from backup
docker exec web_toz_mongo_prod mongorestore --archive=/backup/backup-20231201.gz --gzip
```

### Updates and Maintenance
```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart services
docker-compose -f docker-compose.prod.yml up -d

# Clean up old images
docker image prune -f
```

## Scaling Considerations

### Load Balancing
- Use Nginx or HAProxy for load balancing
- Scale backend instances horizontally
- Consider using Redis for session storage

### Database Scaling
- Implement MongoDB replica sets
- Consider sharding for large datasets
- Use read replicas for better performance

### CDN and Caching
- Use a CDN for static assets
- Implement Redis for application caching
- Configure proper cache headers

## Security Checklist
- [ ] SSL certificates configured
- [ ] Strong passwords and secrets set
- [ ] Database authentication enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Firewall rules configured
- [ ] Regular security updates scheduled
- [ ] Backup and recovery tested