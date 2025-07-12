<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Mero Pasal Producer Insights Platform

This is a Next.js application with Express backend for producers to view market insights and analytics from shopkeeper transaction data.

## Project Structure

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and App Router
- **Backend**: Express.js API server
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase adapter
- **Styling**: Tailwind CSS with custom components

## Key Features

1. **Authentication**: Secure sign-in/sign-up for producers
2. **Subscription Management**: Basic (graphs only) and Pro (detailed insights) tiers
3. **Dashboard**: Interactive charts and insights visualization
4. **Data Integration**: Receives insights from ML models processing shopkeeper data

## Tech Stack Preferences

- Use TypeScript for type safety
- Implement proper error handling and validation
- Follow Next.js 14 App Router patterns
- Use Tailwind CSS for styling
- Implement responsive design
- Use React Query/TanStack Query for data fetching
- Follow security best practices for authentication and data handling

## Architecture

- Next.js frontend communicates with Express backend via API
- Express backend handles business logic and database operations
- Supabase provides PostgreSQL database and real-time subscriptions
- Two-tier subscription model (Basic/Pro) with feature restrictions
