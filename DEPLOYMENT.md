# Deployment Guide


### Step 1: Set up MongoDB Atlas (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/codecommons`)

### Step 2: Deploy Backend to Railway
1. Go to [Railway](https://railway.app) and sign up
2. Create a new project
3. Connect your GitHub repository
4. Select the `codecommons-backend` folder
5. Add these environment variables in Railway:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secret string (you can use the one from your .env.local)
   - `NEXT_PUBLIC_FRONTEND_URL`: Your Vercel frontend URL (e.g., https://codecommons.vercel.app)

### Step 3: Update Frontend Environment
Once Railway deploys your backend, it will give you a URL like `https://your-app.railway.app`

Update your Vercel environment variables:
1. Go to your Vercel project settings
2. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-app.railway.app`
3. Redeploy your frontend

### Step 4: Test
Now users should be able to sign up successfully!

## Alternative: Quick Fix for Testing
If you want to test locally, make sure your backend is running:
```bash
cd codecommons-backend
npm run dev
```

The backend should be running on http://localhost:5050 for local testing. 