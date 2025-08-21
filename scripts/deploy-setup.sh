#!/bin/bash

# CodeCommons Deployment Setup Script
# This script helps set up the deployment environment

echo "🚀 CodeCommons Deployment Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd codecommons-backend
npm install
cd ..

# Check if environment files exist
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating template..."
    cat > .env.local << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/codecommons
MONGODB_DB=codecommons

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5050

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
EOF
    echo "✅ Created .env.local template"
fi

if [ ! -f "codecommons-backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating template..."
    cat > codecommons-backend/.env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/codecommons
MONGODB_DB=codecommons

# Server Configuration
PORT=5050

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
EOF
    echo "✅ Created backend .env template"
fi

# Build the project
echo "🔨 Building frontend..."
npm run build

echo "🔨 Building backend..."
cd codecommons-backend
npm run build
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your MongoDB Atlas connection string"
echo "2. Update codecommons-backend/.env with your MongoDB Atlas connection string"
echo "3. Choose a deployment platform (Render.com recommended for free tier)"
echo "4. Deploy backend to your chosen platform"
echo "5. Deploy frontend to Vercel"
echo ""
echo "For detailed instructions, see DEPLOYMENT-ROADMAP.md" 