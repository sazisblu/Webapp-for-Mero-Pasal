"use client";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Lock,
  Crown,
  Download,
  Target,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const ProFeatureCard = ({
  title,
  description,
  icon: Icon,
  isLocked = false,
  upgradeText = "Upgrade to Pro to unlock this feature",
}: {
  title: string;
  description: string;
  icon: any;
  isLocked?: boolean;
  upgradeText?: string;
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 relative ${
        isLocked ? "opacity-75" : ""
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-90 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 max-w-xs">{upgradeText}</p>
          </div>
        </div>
      )}

      <div className="flex items-center mb-4">
        <div
          className={`p-3 rounded-lg ${
            isLocked ? "bg-gray-200" : "bg-blue-100"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              isLocked ? "text-gray-400" : "text-blue-600"
            }`}
          />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>

      <p className="text-gray-600">{description}</p>

      {!isLocked && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View Details →
          </button>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { user, logout, isLoading } = useUser();
  const isPro = user?.plan === "pro";

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login
          </h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-700">
                मेरो पसल
              </Link>
              <div className="ml-6 flex items-center">
                {isPro ? (
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    <Crown className="h-4 w-4 mr-2" />
                    Pro Account
                  </div>
                ) : (
                  <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
                    Basic Account
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {isPro
              ? "Access all your premium market insights and analytics"
              : "Upgrade to Pro to unlock advanced features and insights"}
          </p>
        </div>

        {/* Upgrade Banner for Basic Users */}
        {!isPro && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-blue-100">
                  Get advanced analytics, price predictions, and export
                  capabilities
                </p>
              </div>
              <Link
                href="/#pricing"
                className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">NPR 45,231</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Products Sold
                </p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+12.5%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Features - Always Available */}
          <ProFeatureCard
            title="Market Overview"
            description="View basic market trends and price information for your products."
            icon={BarChart3}
            isLocked={false}
          />

          <ProFeatureCard
            title="Sales Analytics"
            description="Track your basic sales performance and volume metrics."
            icon={TrendingUp}
            isLocked={false}
          />

          {/* Pro Features - Locked for Basic Users */}
          <ProFeatureCard
            title="Advanced Predictions"
            description="AI-powered price forecasting and market demand predictions."
            icon={Target}
            isLocked={!isPro}
            upgradeText="Upgrade to Pro for AI-powered market predictions"
          />

          <ProFeatureCard
            title="Export & Reports"
            description="Export data to Excel and generate comprehensive market reports."
            icon={Download}
            isLocked={!isPro}
            upgradeText="Upgrade to Pro to export data and generate reports"
          />

          <ProFeatureCard
            title="Seasonal Analysis"
            description="Detailed seasonal trends and calendar-based market insights."
            icon={Calendar}
            isLocked={!isPro}
            upgradeText="Upgrade to Pro for seasonal market analysis"
          />

          <ProFeatureCard
            title="Risk Analytics"
            description="Market risk assessment and early warning systems for price volatility."
            icon={AlertTriangle}
            isLocked={!isPro}
            upgradeText="Upgrade to Pro for risk analytics and alerts"
          />
        </div>

        {/* Pro Features Showcase */}
        {isPro && (
          <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
            <div className="flex items-center mb-6">
              <Crown className="h-8 w-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Pro Features Active
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Advanced Analytics Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  Access detailed market insights with 30+ data points and
                  real-time updates.
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 rounded-lg flex items-center justify-center">
                  <p className="text-white font-medium">
                    Interactive Charts Available
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Market Predictions
                </h3>
                <p className="text-gray-600 mb-4">
                  Get AI-powered forecasts for the next 30 days with 85%
                  accuracy.
                </p>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-32 rounded-lg flex items-center justify-center">
                  <p className="text-white font-medium">
                    Prediction Models Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-600">
                Access your latest market reports
              </p>
            </button>

            <button
              className={`p-4 border rounded-lg text-left transition-colors ${
                isPro
                  ? "border-gray-200 hover:bg-gray-50"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed"
              }`}
              disabled={!isPro}
            >
              <Download
                className={`h-6 w-6 mb-2 ${
                  isPro ? "text-green-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`font-medium ${
                  isPro ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Export Data
              </h3>
              <p
                className={`text-sm ${
                  isPro ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {isPro ? "Download your market data" : "Pro feature"}
              </p>
            </button>

            <button
              className={`p-4 border rounded-lg text-left transition-colors ${
                isPro
                  ? "border-gray-200 hover:bg-gray-50"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed"
              }`}
              disabled={!isPro}
            >
              <Target
                className={`h-6 w-6 mb-2 ${
                  isPro ? "text-purple-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`font-medium ${
                  isPro ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Price Predictions
              </h3>
              <p
                className={`text-sm ${
                  isPro ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {isPro ? "View AI forecasts" : "Pro feature"}
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
