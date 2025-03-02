
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Database, 
  FileCode, 
  Server, 
  Settings, 
  Check,
  Share2,
  Clock,
  Shield
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
              <span className="font-medium">Key Features</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Python-Powered Database Conversion
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl max-w-[800px]">
              Our high-efficiency solution converts Sybase databases to Oracle with precision, preserving data integrity and performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Database className="w-10 h-10" />}
              title="Schema Conversion"
              description="Automatically convert Sybase database schemas, including tables, views, constraints, and indexes to Oracle-compatible formats."
            />
            <FeatureCard
              icon={<FileCode className="w-10 h-10" />}
              title="SQL Translation"
              description="Transform Sybase T-SQL code, stored procedures, triggers, and functions to Oracle PL/SQL with intelligent syntax mapping."
            />
            <FeatureCard
              icon={<Server className="w-10 h-10" />}
              title="Data Migration"
              description="Transfer data with high throughput, maintaining referential integrity and handling complex data types correctly."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Data Validation"
              description="Verify data integrity with comprehensive post-migration validation to ensure all records transfer correctly."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Performance Optimization"
              description="Convert and migrate efficiently using Python's asyncio and parallel processing for larger datasets."
            />
            <FeatureCard
              icon={<Share2 className="w-10 h-10" />}
              title="Shareable Results"
              description="Generate comprehensive reports and easily share conversion results with your team for collaborative review."
            />
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/features">
              <Button variant="outline" size="lg" className="rounded-full group">
                View All Features
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Process section */}
      <section className="py-20 bg-gradient-to-b from-background to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
              <span className="font-medium">How It Works</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Simple 3-Step Process
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl max-w-[800px]">
              Our conversion process is designed to be straightforward yet comprehensive, handling all the complexity behind the scenes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Database</h3>
              <p className="text-muted-foreground">
                Upload your Sybase database schema and data files through our secure interface.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Configure Options</h3>
              <p className="text-muted-foreground">
                Set your conversion preferences and choose which database objects to include.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Download Results</h3>
              <p className="text-muted-foreground">
                Get your Oracle-ready database scripts and comprehensive conversion report.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/converter">
              <Button size="lg" className="rounded-full group">
                Start Converting Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonial section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
              <span className="font-medium">What Users Say</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Trusted by Database Professionals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-background rounded-xl shadow-sm">
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The Python-powered conversion handled our 200+ table Sybase ASE database perfectly. Every stored procedure was converted with minimal manual adjustments needed."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Database Administrator</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-background rounded-xl shadow-sm">
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "We migrated a critical financial application from Sybase to Oracle with near-zero downtime. The data validation feature gave us confidence in the integrity of our migration."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">AS</span>
                </div>
                <div>
                  <p className="font-medium">Alice Smith</p>
                  <p className="text-xs text-muted-foreground">CTO, FinTech Solutions</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-background rounded-xl shadow-sm">
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The detailed conversion reports helped us understand exactly what changed between our Sybase and Oracle implementations. Excellent tool for complex migrations."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">RJ</span>
                </div>
                <div>
                  <p className="font-medium">Robert Johnson</p>
                  <p className="text-xs text-muted-foreground">Lead Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Migrate Your Database?
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Start your Sybase to Oracle conversion today with our high-efficiency Python-powered solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
