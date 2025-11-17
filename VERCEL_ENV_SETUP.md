# Vercel Environment Variables Setup

This document lists all the environment variables that need to be configured in your Vercel project for the application to work correctly.

## Required Environment Variables

### 1. Database Configuration
- **`MONGODB_URI`** (Required)
  - Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - **Important**: This must be set for the database to connect in production

### 2. JWT Authentication Secrets
- **`refresh`** (Required)
  - Secret key for signing refresh tokens
  - Should be a long, random, secure string
  - Example: `your-super-secret-refresh-token-key-here`
  
- **`access`** (Required)
  - Secret key for signing access tokens
  - Should be a long, random, secure string
  - Example: `your-super-secret-access-token-key-here`
  - **Important**: Use different values for refresh and access tokens

### 3. Payment Gateway (Razorpay) - Optional
- **`RAZORPAY_KEY_ID`** (Optional)
  - Your Razorpay key ID
  - Only needed if you're using payment functionality
  
- **`RAZORPAY_KEY_SECRET`** (Optional)
  - Your Razorpay key secret
  - Only needed if you're using payment functionality

### 4. Node Environment
- **`NODE_ENV`** (Automatically set by Vercel)
  - Vercel automatically sets this to `production` for production deployments
  - No need to set manually

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Make sure to select the correct **Environment** (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for the changes to take effect

## Important Notes

- **Never commit `.env` files** to your repository
- **Use strong, random secrets** for JWT tokens (at least 32 characters)
- **Regenerate secrets** if you suspect they've been compromised
- **Test locally** with the same environment variables before deploying
- After adding environment variables, you **must redeploy** your application

## Troubleshooting

### Database Connection Errors
- Verify `MONGODB_URI` is correctly set
- Check that your MongoDB cluster allows connections from Vercel's IP addresses
- Ensure the connection string includes authentication credentials

### Authentication Errors
- Verify both `refresh` and `access` environment variables are set
- Ensure they are different values
- Check that they match your local development environment (if testing)

### Cookie Issues
- Cookies are automatically configured with `secure: true` in production
- Ensure your domain is properly configured in Vercel
- Check browser console for cookie-related errors

## Security Best Practices

1. Use Vercel's environment variable encryption
2. Rotate secrets periodically
3. Use different secrets for different environments (production, preview, development)
4. Never expose secrets in client-side code
5. Use strong, randomly generated strings for JWT secrets



