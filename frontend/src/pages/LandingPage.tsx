import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Search, Star, Shield, Zap } from 'lucide-react';
import { TrainWithXLogo } from '@/components/TrainWithXLogo';
import { goPublic } from '@frontend/lib/nav';

const LandingPage = () => {
  return (
    <div className="min-h-screen-navbar">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 gradient-bg opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <TrainWithXLogo size="xl" showText={false} />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-6xl font-bold mb-6 text-gradient">
              TrainWithX
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your fitness journey with expert-designed training plans
              from top fitness creators worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-bg text-white hover:opacity-90 px-8 py-4 text-lg w-full sm:w-auto"
                onClick={() => goPublic('/plans')}
              >
                Explore All Plans
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 w-full sm:w-auto"
                onClick={() => goPublic('/creators')}
              >
                Meet Our Creators
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-16">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
                500+
              </div>
              <div className="text-muted-foreground">Training Plans</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
                50+
              </div>
              <div className="text-muted-foreground">Expert Creators</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
                10K+
              </div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
                4.9★
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose TrainWithX?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to premium fitness content from verified professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Discover Plans</CardTitle>
              <CardDescription className="text-base">
                Browse hundreds of expert-designed fitness plans tailored to
                your goals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button
                className="w-full gradient-bg text-white hover:opacity-90"
                onClick={() => goPublic('/plans')}
              >
                Browse Plans
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Expert Creators</CardTitle>
              <CardDescription className="text-base">
                Train with certified professionals and fitness influencers you
                trust
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => goPublic('/creators')}
              >
                Meet Creators
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Verified Creators</h3>
            <p className="text-muted-foreground">
              All creators are certified fitness professionals
            </p>
          </div>
          <div className="text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-muted-foreground">
              High-quality video content and detailed instructions
            </p>
          </div>
          <div className="text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
            <p className="text-muted-foreground">
              Start training immediately after purchase
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Ready to Transform?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of people achieving their fitness goals with
            TrainWithX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-bg text-white hover:opacity-90 px-8 py-4 text-lg w-full sm:w-auto"
              onClick={() => goPublic('/plans')}
            >
              Start Training Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-2 w-full sm:w-auto"
              onClick={() => goPublic('/creators')}
            >
              Explore Creators
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
