# Deployment Guide

This guide will walk you through deploying both the frontend and backend of the Restaurant Management System to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Database service (e.g., MongoDB Atlas, PostgreSQL on Railway)
- Node.js and npm installed locally

## Backend Deployment

1. **Prepare Backend Repository**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-backend-github-repo-url>
   git push -u origin main
   ```

2. **Vercel Backend Setup**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your backend GitHub repository
   - Configure the project:
     - Framework Preset: Node.js
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Backend Environment Variables**
   Add these in Vercel project settings:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

## Frontend Deployment

1. **Prepare Frontend Repository**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-frontend-github-repo-url>
   git push -u origin main
   ```

2. **Vercel Frontend Setup**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your frontend GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Frontend Environment Variables**
   Add these in Vercel project settings:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   ```

## Database Setup

1. **Choose a Database Provider**
   - MongoDB Atlas
   - PostgreSQL on Railway
   - Or any other cloud database service

2. **Configure Database**
   - Create a new database instance
   - Get the connection URL
   - Add the URL to your backend environment variables

## Post-Deployment Checklist

1. **Backend Verification**
   - [ ] Test all API endpoints
   - [ ] Verify CORS configuration
   - [ ] Check authentication flow
   - [ ] Test file uploads
   - [ ] Monitor error logs

2. **Frontend Verification**
   - [ ] Test all pages load correctly
   - [ ] Verify API communication
   - [ ] Check authentication flow
   - [ ] Test responsive design
   - [ ] Verify environment variables

3. **Security Checks**
   - [ ] Ensure all sensitive data is in environment variables
   - [ ] Verify CORS settings
   - [ ] Check authentication tokens
   - [ ] Review API security

## Troubleshooting

1. **Common Issues**
   - CORS errors: Check FRONTEND_URL in backend environment variables
   - Database connection: Verify DATABASE_URL
   - Build failures: Check build logs in Vercel
   - API errors: Monitor backend logs

2. **Vercel Logs**
   - Access logs through Vercel dashboard
   - Check both build and runtime logs
   - Monitor error rates and performance

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor Vercel for any issues
   - Check database performance
   - Review error logs regularly

2. **Backup**
   - Regular database backups
   - Code repository backups
   - Environment variable documentation

## Support

For any deployment issues:
1. Check Vercel documentation
2. Review error logs
3. Contact support if needed 