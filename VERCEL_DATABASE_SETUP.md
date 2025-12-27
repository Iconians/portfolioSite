# Vercel Database Connection Setup

## Issue
The application is trying to connect to `localhost:5432` instead of your Neon database, indicating that `DATABASE_URL` is not properly configured on Vercel.

## Solution

### Step 1: Verify DATABASE_URL in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Check if `DATABASE_URL` exists and is set correctly

### Step 2: Set DATABASE_URL Correctly

Your Neon connection string should look like:
```
postgresql://neondb_owner:YOUR_PASSWORD@neondb-xxxxx-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require
```

**Important:**
- Use the **pooled connection string** (contains `-pooler` in the hostname)
- Do NOT wrap it in quotes in Vercel's UI
- Make sure it starts with `postgresql://` (not `postgres://`)
- The connection string should be set for **Production**, **Preview**, and **Development** environments

### Step 3: Verify the Format

The connection string format should be:
```
postgresql://[username]:[password]@[hostname]/[database]?[params]
```

Example:
```
postgresql://neondb_owner:abc123@neondb-xxxxx-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Step 4: Redeploy

After setting the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger a new deployment

### Step 5: Check the Logs

After redeploying, check the Vercel logs. You should now see:
- `[DB] Initializing database connection...`
- `[DB] Connection string (masked): postgresql://neondb_owner:****@...`
- `[DB] Contains neon: true`
- `[DB] Hostname pattern: ***.pooler.***.neon.tech...`

If you still see `localhost:5432` in the logs, the `DATABASE_URL` is still not set correctly.

## Common Issues

### Issue 1: Quotes in the Connection String
**Problem:** Vercel might add quotes when copying/pasting
**Solution:** Remove any quotes from the beginning and end of the connection string

### Issue 2: Wrong Environment
**Problem:** `DATABASE_URL` is only set for one environment (e.g., Production) but not Preview
**Solution:** Set it for all environments (Production, Preview, Development)

### Issue 3: Using Direct Connection Instead of Pooled
**Problem:** Using the direct connection string instead of the pooled one
**Solution:** Use the connection string that contains `-pooler` in the hostname

### Issue 4: Missing SSL Parameters
**Problem:** Connection string doesn't include `sslmode=require`
**Solution:** Add `?sslmode=require` to the end of the connection string

## Testing Locally

To test if your connection string works locally:

1. Create a `.env.local` file in your project root:
```bash
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@neondb-xxxxx-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require"
```

2. Run the development server:
```bash
bun run dev
```

3. Check the console logs for `[DB]` messages to verify the connection is working

## Getting Your Neon Connection String

1. Log in to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **Connection Details**
4. Copy the **Pooled connection** string (not the direct connection)
5. Use this string in Vercel's environment variables
