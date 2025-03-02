
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Check, FileText } from "lucide-react";

const Results = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
            <span className="font-medium">Conversion Results</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
            Your Database Conversion is Complete
          </h1>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            Review your conversion results and download your Oracle-ready database files.
          </p>
        </div>
        
        <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Conversion Successful</h3>
                <p className="text-sm text-muted-foreground">All database objects were successfully converted</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Schema Objects</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Tables</span>
                    <span className="font-medium">24 converted</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Views</span>
                    <span className="font-medium">8 converted</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Stored Procedures</span>
                    <span className="font-medium">12 converted</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Triggers</span>
                    <span className="font-medium">6 converted</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Data Migration</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Total Records</span>
                    <span className="font-medium">142,856</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Data Size</span>
                    <span className="font-medium">256 MB</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Migration Time</span>
                    <span className="font-medium">1m 24s</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Validation Status</span>
                    <span className="text-green-600 font-medium">Passed</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 mt-4">
              <h3 className="font-medium">Download Files</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Button variant="outline" className="justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Oracle Schema Scripts
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Data Export Files
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Conversion Report
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Validation Summary
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Link to="/converter">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Converter
              </Button>
            </Link>
            <Button>Download All Files</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
