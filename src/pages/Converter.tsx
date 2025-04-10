
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
          <h1 className="text-2xl font-bold tracking-tighter md:text-3xl mb-2">
            Database Converter
          </h1>
          <p className="text-muted-foreground max-w-[600px]">
            Upload your database files for quick conversion with side-by-side comparison
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
