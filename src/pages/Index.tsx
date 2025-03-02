
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Database, 
  FileCode, 
  Server
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* Core features section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
              Core Features
            </h2>
            <p className="mt-2 text-muted-foreground max-w-[600px]">
              Python-powered database conversion with all the essentials
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<Database className="w-6 h-6" />}
              title="Schema Conversion"
              description="Convert Sybase database schemas to Oracle-compatible formats."
            />
            <FeatureCard
              icon={<FileCode className="w-6 h-6" />}
              title="SQL Translation"
              description="Transform T-SQL code to Oracle PL/SQL with automatic syntax mapping."
            />
            <FeatureCard
              icon={<Server className="w-6 h-6" />}
              title="Data Migration"
              description="Transfer data while maintaining referential integrity."
            />
          </div>
          
          <div className="flex justify-center mt-8">
            <Link to="/features">
              <Button variant="outline" size="sm" className="group">
                All Features
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
              Ready to Convert?
            </h2>
            <p className="text-muted-foreground max-w-[500px]">
              Start your Sybase to Oracle conversion today
            </p>
            <Link to="/converter">
              <Button size="lg" className="mt-2">
                Start Converting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
