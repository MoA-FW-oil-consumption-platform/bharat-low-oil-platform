import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl text-center">
          <div className="mb-8">
            <span className="text-8xl">🇮🇳</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bharat Low Oil Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Track your oil consumption, discover healthy recipes, and join millions of Indians
            in building a healthier nation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-green-600"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Consumption</h3>
              <p className="text-gray-600">Monitor your daily oil intake and set healthy goals</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Healthy Recipes</h3>
              <p className="text-gray-600">Discover delicious low-oil recipes from Indian cuisine</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Rewards</h3>
              <p className="text-gray-600">Get points and badges for maintaining healthy habits</p>
            </div>
          </div>

          {/* Government Badge */}
          <div className="mt-12">
            <p className="text-sm text-gray-600">
              A Government of India Initiative
              <br />
              <span className="font-medium">Ministry of Agriculture & Farmers Welfare</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
