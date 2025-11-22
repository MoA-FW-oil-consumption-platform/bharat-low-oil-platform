import Link from 'next/link';
import { Droplet, TrendingDown, Award, ChefHat, Target, Users } from 'lucide-react';
import { LandingPageRedirect } from '@/components/auth/landing-redirect';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingPageRedirect />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplet className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Bharat Low Oil</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Reduce Oil Consumption
            <br />
            <span className="text-primary">Improve Your Health</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the nationwide initiative to reduce edible oil consumption by 10%.
            Track your usage, get AI-powered insights, and earn rewards.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">Get Started Free</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">View Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-primary text-primary-foreground py-16 animate-fade-in-up delay-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">25K+</div>
              <div className="text-primary-foreground/80 font-medium">Early Adopters</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">12%</div>
              <div className="text-primary-foreground/80 font-medium">Avg Reduction</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-primary-foreground/80 font-medium">Partner Restaurants</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80 font-medium">Curated Recipes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up delay-200">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Everything You Need to Track Oil Consumption
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingDown className="h-8 w-8 text-primary" />}
            title="Smart Tracking"
            description="Log consumption manually or connect IoT weight sensors for automatic tracking"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-primary" />}
            title="Earn Rewards"
            description="Get points, badges, and achievements for meeting your reduction goals"
          />
          <FeatureCard
            icon={<ChefHat className="h-8 w-8 text-primary" />}
            title="Low-Oil Recipes"
            description="Access 500K+ healthy recipes in English, Hindi, and Tamil"
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-primary" />}
            title="AI Predictions"
            description="Get personalized consumption forecasts and health insights"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Join Campaigns"
            description="Participate in national challenges and compete with friends"
          />
          <FeatureCard
            icon={<Droplet className="h-8 w-8 text-primary" />}
            title="ICMR Guidelines"
            description="Stay within recommended limits with real-time health status"
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary/30 py-20 animate-fade-in-up delay-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up delay-300">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Start Your Health Journey?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the movement. Reduce oil consumption. Live healthier.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">Get Started Now</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Droplet className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">Bharat Low Oil</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Government of India Initiative to reduce edible oil consumption by 10%
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/tracking" className="hover:text-primary transition-colors">Tracking</Link></li>
                <li><Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link></li>
                <li><Link href="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/guidelines" className="hover:text-primary transition-colors">ICMR Guidelines</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
            © 2025 Bharat Low Oil Platform. Part of Government of India Initiative.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="mb-2 p-3 bg-primary/10 w-fit rounded-lg">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}
