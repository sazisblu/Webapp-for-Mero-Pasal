#!/bin/bash

# Mero Pasal Setup Script
echo "🚀 Setting up Mero Pasal Producer Insights Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create environment files if they don't exist
if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend environment file..."
    cp frontend/.env.example frontend/.env.local
    echo "⚠️  Please update frontend/.env.local with your Supabase credentials"
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your Supabase credentials"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Set up your Supabase database:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the SQL commands in database/schema.sql"
echo "   - Get your Supabase URL and keys"
echo ""
echo "2. Update environment variables:"
echo "   - Frontend: .env.local"
echo "   - Backend: backend/.env"
echo ""
echo "3. Start the development servers:"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Backend: cd backend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Check README.md for detailed instructions"
echo "🚀 Happy coding!"
