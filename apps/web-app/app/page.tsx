import Link from 'next/link';
import { Droplet, TrendingDown, Award, ChefHat, Target, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplet className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Bharat Low Oil</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-green-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Reduce Oil Consumption
            <br />
            <span className="text-green-600">Improve Your Health</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join millions of Indians in PM Modi&apos;s initiative to reduce edible oil consumption by 10%.
            Track your usage, get AI-powered insights, and earn rewards.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2.4M+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">18.7%</div>
              <div className="text-green-100">Avg Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,245</div>
              <div className="text-green-100">Certified Restaurants</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-green-100">Low-Oil Recipes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Track Oil Consumption
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingDown className="h-8 w-8 text-green-600" />}
            title="Smart Tracking"
            description="Log consumption manually or connect IoT weight sensors for automatic tracking"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-green-600" />}
            title="Earn Rewards"
            description="Get points, badges, and achievements for meeting your reduction goals"
          />
          <FeatureCard
            icon={<ChefHat className="h-8 w-8 text-green-600" />}
            title="Low-Oil Recipes"
            description="Access 500K+ healthy recipes in English, Hindi, and Tamil"
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-green-600" />}
            title="AI Predictions"
            description="Get personalized consumption forecasts and health insights"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-green-600" />}
            title="Join Campaigns"
            description="Participate in national challenges and compete with friends"
          />
          <FeatureCard
            icon={<Droplet className="h-8 w-8 text-green-600" />}
            title="ICMR Guidelines"
            description="Stay within recommended limits with real-time health status"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Create Account"
              description="Sign up for free and set your health goals"
            />
            <Step
              number="2"
              title="Track Consumption"
              description="Log your daily oil usage or connect smart sensors"
            />
            <Step
              number="3"
              title="Get Insights"
              description="Receive AI-powered recommendations and earn rewards"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Your Health Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join the movement. Reduce oil consumption. Live healthier.
        </p>
        <Link
          href="/register"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Droplet className="h-6 w-6" />
                <span className="font-bold">Bharat Low Oil</span>
              </div>
              <p className="text-gray-400 text-sm">
                Government of India Initiative to reduce edible oil consumption by 10%
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/tracking">Tracking</Link></li>
                <li><Link href="/recipes">Recipes</Link></li>
                <li><Link href="/restaurants">Restaurants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/guidelines">ICMR Guidelines</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 Bharat Low Oil Platform. Part of Government of India Initiative.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
