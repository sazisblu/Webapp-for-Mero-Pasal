-- Mero Pasal Database Schema for Supabase
-- Run these queries in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for producer authentication
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription tiers enum 
CREATE TYPE subscription_tier AS ENUM ('basic', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'basic',
    status subscription_status NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table for categorizing insights
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market insights table (receives data from ML models)
CREATE TABLE market_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- 'demand', 'price_trend', 'seasonality', 'competition'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    data JSONB, -- Stores structured insight data
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    region VARCHAR(100),
    time_period VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'quarterly'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE
);

-- Analytics data for graphs and charts
CREATE TABLE analytics_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'sales_volume', 'price', 'demand_index', 'market_share'
    value DECIMAL(12,2) NOT NULL,
    unit VARCHAR(20), -- 'rupees', 'units', 'percentage', 'index'
    date_recorded DATE NOT NULL,
    region VARCHAR(100),
    source VARCHAR(100) DEFAULT 'shopkeeper_transactions',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User access logs for tracking feature usage
CREATE TABLE user_access_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_accessed VARCHAR(100) NOT NULL,
    access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_tier subscription_tier NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_market_insights_product_id ON market_insights(product_id);
CREATE INDEX idx_market_insights_type ON market_insights(insight_type);
CREATE INDEX idx_analytics_data_product_date ON analytics_data(product_id, date_recorded);
CREATE INDEX idx_analytics_data_metric_type ON analytics_data(metric_type);
CREATE INDEX idx_user_access_logs_user_id ON user_access_logs(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Subscription policies
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Market insights - all authenticated users can read, but access is controlled by subscription tier in application logic
CREATE POLICY "Authenticated users can view insights" ON market_insights FOR SELECT TO authenticated USING (true);

-- Analytics data - similar to insights
CREATE POLICY "Authenticated users can view analytics" ON analytics_data FOR SELECT TO authenticated USING (true);

-- Access logs - users can only see their own logs
CREATE POLICY "Users can view own access logs" ON user_access_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert access logs" ON user_access_logs FOR INSERT WITH CHECK (true);

-- Insert sample data
INSERT INTO products (name, category, subcategory, description) VALUES
('Rice', 'Grains', 'Staple Grains', 'Premium quality rice from local farms'),
('Wheat Flour', 'Grains', 'Processed Grains', 'Refined wheat flour for baking'),
('Tomatoes', 'Vegetables', 'Fresh Vegetables', 'Fresh tomatoes from local farms'),
('Onions', 'Vegetables', 'Fresh Vegetables', 'Red and white onions'),
('Chicken', 'Meat', 'Poultry', 'Fresh chicken meat'),
('Milk', 'Dairy', 'Fresh Dairy', 'Fresh cow milk'),
('Cooking Oil', 'Oils', 'Edible Oils', 'Refined cooking oil'),
('Lentils', 'Pulses', 'Dal', 'Various types of lentils'),
('Sugar', 'Sweeteners', 'Refined Sugar', 'White refined sugar'),
('Tea', 'Beverages', 'Hot Beverages', 'Black tea leaves');

-- Insert sample analytics data (for demonstration)
INSERT INTO analytics_data (product_id, metric_type, value, unit, date_recorded, region) 
SELECT 
    p.id,
    'sales_volume',
    (RANDOM() * 1000 + 100)::DECIMAL(12,2),
    'units',
    CURRENT_DATE - (RANDOM() * 30)::INTEGER,
    (ARRAY['Kathmandu', 'Pokhara', 'Chitwan', 'Lalitpur', 'Bhaktapur'])[FLOOR(RANDOM() * 5 + 1)]
FROM products p, generate_series(1, 5) AS gs;
