
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Sybase to Oracle Database Migration
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-[700px]">
            Simple, efficient conversion tool powered by Python
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/converter">
              <Button size="lg" className="w-full sm:w-auto">
                Start Converting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="pt-8 md:pt-16 w-full max-w-md mx-auto">
            <div className="aspect-video bg-muted rounded-lg border flex items-center justify-center">
              <Database className="w-16 h-16 text-primary opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
