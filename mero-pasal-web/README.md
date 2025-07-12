# Mero Pasal Producer Insights Platform

A complete web application for producers to view market insights and analytics from shopkeeper transaction data. Built with Next.js frontend and Express.js backend, using Supabase as the database.

## Features

### Authentication & User Management

- **User Registration & Login**: Secure authentication for producers
- **Profile Management**: Update user profile and change passwords
- **JWT-based Authentication**: Secure token-based authentication

### Subscription Management

- **Two-Tier System**: Basic (Free) and Pro (NPR 2,999/month) plans
- **Feature Access Control**: Basic users get graphs, Pro users get detailed insights
- **Subscription Management**: Upgrade, downgrade, and cancel subscriptions

### Dashboard & Analytics

- **Market Analytics**: Interactive charts showing sales volume, price trends, demand patterns
- **Dashboard Summary**: Overview of products, data points, and latest updates
- **Basic Features (Free Tier)**:
  - Basic market graphs
  - Sales volume charts
  - Price trend visualization
  - Monthly reports
  - Email support

### Pro Features (Paid Tier)

- **Detailed Market Insights**: AI-powered market analysis
- **Advanced Analytics**: Comprehensive market statistics and trends
- **Market Predictions**: Future market trend predictions
- **Competitor Analysis**: Insights into competitor pricing and positioning
- **Real-time Data**: Live market data updates
- **Custom Reports**: Tailored analytical reports
- **Priority Support**: Dedicated customer support
- **API Access**: Programmatic access to data

## Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **TanStack Query**: Data fetching and caching

### Backend

- **Express.js**: Node.js web framework
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **CORS & Helmet**: Security middleware

### Database

- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security**: Database-level security policies
- **Authentication Integration**: Built-in auth with Supabase

## Project Structure

```
mero-pasal-web/
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page
│   │   │   └── globals.css     # Global styles
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication context
│   │   └── lib/                # Utilities
│   │       └── api.ts          # API client
│   ├── package.json            # Frontend dependencies
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── tsconfig.json           # TypeScript configuration
├── backend/                    # Express.js Backend
│   ├── config/                 # Configuration files
│   ├── middleware/             # Express middleware
│   ├── routes/                 # API routes
│   ├── server.js               # Main server file
│   └── package.json            # Backend dependencies
├── database/
│   └── schema.sql              # Supabase database schema
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### 2. Clone and Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from `database/schema.sql` to create the database schema
4. Note down your Supabase URL and keys

### 4. Environment Configuration

#### Frontend (frontend/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

#### Backend (backend/.env)

```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
DATABASE_URL=your_supabase_database_url
```

### 5. Running the Application

#### Development Mode

Terminal 1 - Frontend:

```bash
cd frontend
npm run dev
```

Terminal 2 - Backend:

```bash
cd backend
npm run dev
```

#### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start frontend
npm start

# Start backend
cd ../backend
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token

### Subscriptions

- `GET /api/subscriptions/status` - Get subscription status
- `POST /api/subscriptions/upgrade` - Upgrade to Pro
- `POST /api/subscriptions/downgrade` - Downgrade to Basic
- `GET /api/subscriptions/tiers` - Get pricing tiers

### Analytics (Basic Tier)

- `GET /api/analytics/graphs` - Get analytics graphs data
- `GET /api/analytics/dashboard/summary` - Get dashboard summary
- `GET /api/analytics/products` - Get products list

### Insights (Pro Tier)

- `GET /api/insights` - Get market insights
- `GET /api/insights/:id` - Get specific insight
- `GET /api/insights/summary/overview` - Get insights summary
- `GET /api/insights/category/:category` - Get insights by category

### Advanced Analytics (Pro Tier)

- `GET /api/analytics/advanced` - Get advanced analytics

### User Management

- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users/activity` - Get user activity logs

## Database Schema

### Core Tables

- **users**: Producer authentication and profile data
- **subscriptions**: Subscription management and tiers
- **products**: Product catalog and categorization
- **market_insights**: AI-generated market insights (Pro feature)
- **analytics_data**: Time-series analytics data for graphs
- **user_access_logs**: Feature usage tracking

### Subscription Tiers

- **Basic (Free)**: Access to basic graphs and analytics
- **Pro (NPR 2,999/month)**: Access to detailed insights and advanced features

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Row Level Security**: Database-level access control
- **CORS Protection**: Cross-origin request security
- **Helmet Middleware**: Security headers
- **Input Validation**: Request validation and sanitization
- **Rate Limiting**: API rate limiting (can be added)

## Deployment

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)

1. Create new app
2. Set environment variables
3. Deploy from GitHub

### Database

- Supabase handles hosting and scaling automatically
- Configure production environment variables
- Set up database backups

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Email: support@meropasal.com
- Create an issue on GitHub
- Pro subscribers get priority support

---

**Mero Pasal** - Empowering producers with data-driven market insights.
