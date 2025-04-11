
import { useEffect } from "react";
import ConversionForm from "@/components/ConversionForm";

const Converter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3">
            Sybase to Oracle Converter
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
            Upload your SQL files or entire folders for high-performance conversion with optimized Oracle output
          </p>
          <p className="text-md text-green-600 max-w-[700px] mt-2">
            Now with enhanced optimization for large database files and improved batch processing
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-4xl p-6 bg-background rounded-lg border shadow-sm">
            <ConversionForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
