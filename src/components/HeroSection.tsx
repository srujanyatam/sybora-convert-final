
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Server, Check } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-white/30 pointer-events-none"></div>
      
      {/* Background circle decorations */}
      <div className="absolute -left-40 -top-40 w-[30rem] h-[30rem] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -right-40 top-20 w-[45rem] h-[45rem] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4 transition-all duration-700 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="font-medium">New Version Available</span>
              </div>
              
              <h1
                className={`text-balance text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl transition-all duration-700 delay-100 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Migrate Your Sybase Database <br className="hidden sm:inline" />
                to Oracle with Precision
              </h1>
              
              <p
                className={`mx-auto max-w-[700px] text-muted-foreground md:text-xl transition-all duration-700 delay-200 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                High-efficiency Python-powered database conversion tool that ensures seamless migration with data integrity verification.
              </p>
            </div>
            
            <div
              className={`mx-auto w-full max-w-sm space-x-4 pt-4 transition-all duration-700 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link to="/converter">
                <Button size="lg" className="rounded-full group">
                  Start Converting
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div
              className={`flex justify-center gap-4 items-center pt-4 transition-all duration-700 delay-400 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Effortless Conversion</span>
              </div>
              <div className="h-5 border-l border-border/40"></div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Data Integrity</span>
              </div>
              <div className="h-5 border-l border-border/40"></div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">High Performance</span>
              </div>
            </div>
          </div>
          
          <div
            className={`flex items-center justify-center p-8 transition-all duration-1000 delay-500 ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative w-full max-w-3xl aspect-video rounded-xl backdrop-blur glass-panel border border-white/20 overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-background/90">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Database className="w-16 h-16 text-primary mb-4" />
                  <div className="flex items-center gap-4 mb-2">
                    <Server className="w-10 h-10 text-muted-foreground" />
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse-subtle" />
                    <Database className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Sybase to Oracle Migration</h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Python-powered database conversion with schema translation, data transfer, and validation in one tool
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
