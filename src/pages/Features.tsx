
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, FileCode, Server, Shield, Clock, Share2 } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const Features = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
            <span className="font-medium">Key Features</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
            Database Conversion Features
          </h1>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            Our Python-powered solution provides everything you need for smooth Sybase to Oracle migration.
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
          <Link to="/converter">
            <Button size="lg" className="rounded-full group">
              Start Converting Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
