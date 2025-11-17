# How to Get Your MongoDB URI

This guide explains how to obtain your MongoDB connection string (URI) from different MongoDB providers.

## Option 1: MongoDB Atlas (Cloud - Recommended)

MongoDB Atlas is the most common cloud MongoDB service. Here's how to get your connection string:

### Step 1: Create/Login to MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (or log in if you already have one)
3. The free tier (M0) is perfect for development and small projects

### Step 2: Create a Cluster
1. Click "Build a Database" or "Create" → "Database"
2. Choose the **FREE** (M0) tier
3. Select a cloud provider and region (choose one closest to your Vercel deployment)
4. Give your cluster a name (e.g., "Cluster0")
5. Click "Create Cluster"

### Step 3: Create Database User
1. In the Security section, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and generate a secure password (save this password!)
5. Under "Database User Privileges", select "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. In the Security section, click "Network Access"
2. Click "Add IP Address"
3. For Vercel deployment, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, consider restricting to Vercel's IP ranges
4. Click "Confirm"

### Step 5: Get Your Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Select "Node.js" as the driver
4. Copy the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace the placeholders**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password (URL-encode special characters if any)
   - Optionally add your database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/your-database-name?retryWrites=true&w=majority`

### Example MongoDB URI:
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/toodies?retryWrites=true&w=majority
```

## Option 2: Local MongoDB

If you're running MongoDB locally on your machine:

### For Local Development:
```
mongodb://localhost:27017/your-database-name
```

### For Production (Not Recommended):
- Local MongoDB is not accessible from Vercel
- You'll need to use MongoDB Atlas or another cloud provider
- Or set up a VPN/tunnel (complex, not recommended)

## Option 3: Other MongoDB Hosting Providers

### MongoDB Compass (Local):
```
mongodb://localhost:27017/your-database-name
```

### MongoDB Cloud (Other providers):
- Follow similar steps as MongoDB Atlas
- Connection string format is usually:
  ```
  mongodb+srv://username:password@host/database?options
  ```
  or
  ```
  mongodb://username:password@host:port/database?options
  ```

## Connection String Format Breakdown

A MongoDB URI typically looks like:
```
mongodb+srv://username:password@host/database-name?options
```

### Components:
- `mongodb+srv://` - Protocol (SRV for Atlas, regular `mongodb://` for others)
- `username` - Your database username
- `password` - Your database password
- `host` - Your MongoDB server address
- `database-name` - Name of your database (optional, can be specified in code)
- `?options` - Connection options (retryWrites, w=majority, etc.)

## Security Notes

### Password Encoding:
If your password contains special characters, you need to URL-encode them:
- `@` becomes `%40`
- `:` becomes `%3A`
- `/` becomes `%2F`
- `#` becomes `%23`
- `?` becomes `%3F`
- `&` becomes `%26`
- `=` becomes `%3D`
- ` ` (space) becomes `%20`

### Example with special characters:
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- URI: `mongodb+srv://user:my%40pass%23123@cluster0.xxxxx.mongodb.net/`

### IP Whitelisting:
- For development: You can use `0.0.0.0/0` (allow all IPs)
- For production: Consider restricting to specific IP ranges
- Vercel uses dynamic IPs, so `0.0.0.0/0` is often necessary

## Testing Your Connection String

### Test Locally:
1. Create a `.env.local` file in your project root:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/toodies?retryWrites=true&w=majority
   ```
2. Run your application locally:
   ```bash
   npm run dev
   ```
3. Try creating an account - if it works, your connection string is correct

### Test in Vercel:
1. Add the `MONGODB_URI` to Vercel environment variables
2. Redeploy your application
3. Check Vercel function logs for connection errors
4. Try creating an account on your deployed site

## Troubleshooting

### "Authentication failed" error:
- Check username and password are correct
- Verify password is URL-encoded if it has special characters
- Ensure database user has proper permissions

### "Connection timeout" error:
- Check Network Access in MongoDB Atlas - ensure your IP is whitelisted (or use 0.0.0.0/0)
- Verify the connection string is correct
- Check if your firewall is blocking the connection

### "Database connection failed" error:
- Verify `MONGODB_URI` is set in Vercel environment variables
- Check the connection string format
- Ensure MongoDB cluster is running (not paused)
- Check Vercel function logs for detailed error messages

### "MONGODB_URI is not set" error:
- Verify the environment variable name is exactly `MONGODB_URI` (case-sensitive)
- Ensure it's set in the correct environment (Production, Preview, Development)
- Redeploy after adding the environment variable

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with username and password
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string obtained and formatted correctly
- [ ] Password URL-encoded if it contains special characters
- [ ] Database name added to connection string (optional but recommended)
- [ ] Connection string tested locally
- [ ] Connection string added to Vercel environment variables
- [ ] Application redeployed on Vercel

## Need Help?

If you're still having issues:
1. Check MongoDB Atlas dashboard for cluster status
2. Review Vercel function logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test the connection string locally first
5. Ensure your MongoDB cluster is not paused (free tier clusters can auto-pause)



