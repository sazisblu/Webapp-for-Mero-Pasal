@echo off
echo 🚀 Setting up Mero Pasal Producer Insights Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm found

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd ..\backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Create environment files if they don't exist
if not exist frontend\.env.local (
    echo 📝 Creating frontend environment file...
    copy frontend\.env.example frontend\.env.local
    echo ⚠️  Please update frontend\.env.local with your Supabase credentials
)

if not exist backend\.env (
    echo 📝 Creating backend environment file...
    copy backend\.env.example backend\.env
    echo ⚠️  Please update backend\.env with your Supabase credentials
)

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Set up your Supabase database:
echo    - Create a new project at https://supabase.com
echo    - Run the SQL commands in database/schema.sql
echo    - Get your Supabase URL and keys
echo.
echo 2. Update environment variables:
echo    - Frontend: .env.local
echo    - Backend: backend\.env
echo.
echo 3. Start the development servers:
echo    - Frontend: cd frontend ^&^& npm run dev
echo    - Backend: cd backend ^&^& npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 Check README.md for detailed instructions
echo 🚀 Happy coding!
echo.
pause
