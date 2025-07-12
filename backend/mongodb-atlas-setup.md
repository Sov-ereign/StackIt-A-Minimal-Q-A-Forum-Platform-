# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" and create an account
3. Choose the FREE tier (M0)

## Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select a cloud provider (AWS/Google Cloud/Azure) and region
4. Click "Create"

## Step 3: Set Up Database Access
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Your Connection String
1. Go back to "Database" in the sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

## Step 6: Update Your .env File
Replace the MONGO_URI in your `.env` file with:

```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/qa_app?retryWrites=true&w=majority
```

Replace:
- `YOUR_USERNAME` with your database username
- `YOUR_PASSWORD` with your database password  
- `YOUR_CLUSTER` with your actual cluster name

## Step 7: Restart Your Backend
```bash
cd backend
npm run dev
```

Your app should now work with MongoDB Atlas! 🎉 