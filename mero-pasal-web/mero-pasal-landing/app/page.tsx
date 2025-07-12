import Link from "next/link"
import { Check, BarChart3, Zap, DollarSign } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-12">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-700">मेरो पसल</h1>
            </div>
            <div className="space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Producer Insights Platform</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get real-time market insights and analytics from shopkeeper transaction data. Make informed decisions
              about your products with AI-powered market intelligence.
            </p>
            <div className="space-x-4">
              <Link
                href="/register"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Analytics</h3>
              <p className="text-gray-600">
                View comprehensive graphs and charts showing sales volumes, price trends, and demand patterns.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get detailed market insights and predictions powered by machine learning models.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Pricing</h3>
              <p className="text-gray-600">
                Choose between Basic (graphs only) or Pro (detailed insights) subscription tiers.
              </p>
            </div>
          </div>

          {/* Pricing Section with Mascot */}
          <div className="mt-20 mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Simple Pricing</h2>
            <p className="text-lg text-gray-600 mb-16 text-center max-w-2xl mx-auto">
              Choose the perfect plan for your business needs
            </p>

            {/* Pricing Container */}
            <div className="relative max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16">
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-shrink-0 lg:mt-8">
                  {/* Basic Plan */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full max-w-sm">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Basic</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-green-600">Free</span>
                      </div>
                      <p className="text-gray-600 mb-6">Perfect for getting started</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {["Basic market graphs", "Sales volume charts", "Monthly reports", "Email support"].map(
                        (feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ),
                      )}
                    </ul>

                    <Link
                      href="/register"
                      className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Get Started Free
                    </Link>
                  </div>

                  {/* Pro Plan */}
                  <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full max-w-sm">
                    {/* Popular Badge */}
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white">
                        Most Popular
                      </span>
                    </div>

                    <div className="text-center pt-6">
                      <h3 className="text-2xl font-bold mb-2">Pro</h3>
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-gray-900">NPR 2,999</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      <p className="text-gray-600 mb-6">For serious producers</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        "Everything in Basic",
                        "Detailed market insights",
                        "AI-powered predictions",
                        "Competitor analysis",
                        "Priority support",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/register"
                      className="w-full block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Start Pro Trial
                    </Link>
                  </div>
                </div>

                {/* Mascot Section */}
                <div className="hidden lg:block relative ml-8 mt-28">
                  <div className="relative">
                    {/* Name Tag Above Head */}
                    <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-2 shadow-lg text-center border border-blue-100 z-10">
                      <p className="text-lg font-bold text-blue-700">Bakhre Baje</p>
                      <p className="text-xs text-gray-600">Your Market Guide</p>
                    </div>

                    {/* Goat Mascot */}
                    <div className="relative">
                      <img
                        src="/goat-mascot.png"
                        alt="Bakhre Baje - Your friendly market guide"
                        className="w-80 h-80 object-contain mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        style={{
                          filter: "drop-shadow(0 20px 45px rgba(0,0,0,0.25))", // Enhanced drop shadow
                        }}
                      />

                      {/* Floating Animation Elements */}
                      <div className="absolute -top-6 right-8 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute bottom-16 -left-8 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-75"></div>
                      <div className="absolute top-1/4 -right-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-75"></div>
                      <div
                        className="absolute top-2/3 -left-6 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"
                        style={{ animationDelay: "1s" }}
                      ></div>

                      {/* Sparkle effects */}
                      <div className="absolute top-8 left-4 text-yellow-400 animate-pulse text-lg">✨</div>
                      <div
                        className="absolute bottom-20 right-4 text-yellow-400 animate-bounce text-sm"
                        style={{ animationDelay: "0.5s" }}
                      >
                        ⭐
                      </div>
                    </div>

                    {/* Rating below mascot */}
                    <div className="mt-4 text-center">
                      <div className="flex justify-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400">⭐</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Helping Nepali producers since 2024</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Mascot */}
                <div className="lg:hidden mt-12 text-center">
                  <div className="inline-block relative">
                    <img
                      src="/goat-mascot.png"
                      alt="Bakhre Baje - Your friendly market guide"
                      className="w-56 h-56 object-contain mx-auto drop-shadow-xl" // Enhanced drop shadow for mobile
                    />

                    {/* Mobile floating elements */}
                    <div className="absolute -top-2 right-8 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-8 -left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-md border border-blue-100">
                      <p className="text-lg font-bold text-blue-700">Bakhre Baje 🐐</p>
                      <p className="text-sm text-gray-600">Your Market Guide</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-white rounded-lg p-4 shadow-md max-w-xs mx-auto border border-gray-100">
                    <p className="text-sm font-medium text-gray-800">नमस्ते! Perfect plans for every producer! 🎯</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
