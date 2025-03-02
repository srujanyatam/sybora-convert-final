
import { useEffect } from "react";
import ConversionForm from "@/components/ConversionForm";

const Converter = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
            <span className="font-medium">Database Converter</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
            Sybase to Oracle Conversion
          </h1>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            Upload your Sybase database file, configure conversion options, and get Oracle-ready results.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-sm">
            <ConversionForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
