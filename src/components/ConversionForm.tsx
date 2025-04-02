
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import FileUploader from "./FileUploader";
import { ArrowRight, Check, Download, ArrowDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { calculatePerformanceMetrics } from "@/lib/conversionMetrics";

const FormSchema = z.object({
  sourceType: z.string().default("sybase"),
  targetType: z.string().default("oracle"),
  sybaseCode: z.string().optional(),
});

const ConversionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [convertedCode, setConvertedCode] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    originalComplexity: number;
    convertedComplexity: number;
    performanceImprovement: string;
  } | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceType: "sybase",
      targetType: "oracle",
      sybaseCode: "",
    },
  });
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setConvertedCode(null);
    setManualInput(false);
    setShowComparison(false);
    form.setValue("sybaseCode", "");
  };
  
  const handleManualInputToggle = () => {
    setManualInput(!manualInput);
    if (!manualInput) {
      setFile(null);
    } else {
      form.setValue("sybaseCode", "");
    }
    setConvertedCode(null);
    setShowComparison(false);
  };
  
  const convertSybaseToOracle = (sybaseCode: string): string => {
    // This is a simple example conversion logic
    // In a real app, this would be more sophisticated or call a backend service
    
    // Detect if it's a stored procedure
    if (sybaseCode.includes("CREATE PROCEDURE")) {
      // Extract procedure name
      const procedureNameMatch = sybaseCode.match(/CREATE\s+PROCEDURE\s+(\w+)/i);
      const procedureName = procedureNameMatch ? procedureNameMatch[1] : "UnknownProcedure";
      
      // Basic conversion of Sybase procedure to Oracle
      let oracleCode = sybaseCode
        // Replace procedure declaration
        .replace(/CREATE\s+PROCEDURE\s+(\w+)/i, "CREATE OR REPLACE PROCEDURE $1(EmployeeCount OUT NUMBER)")
        // Add INTO clause for SELECTs that don't have it
        .replace(/SELECT\s+COUNT\(\*\)\s+AS\s+(\w+)/i, "SELECT COUNT(*) INTO $1")
        // Ensure there's a semicolon at the end of statements
        .replace(/END$/i, "END;");
      
      return oracleCode;
    }
    
    // If it's a table creation or other SQL
    if (sybaseCode.includes("CREATE TABLE")) {
      return sybaseCode
        .replace(/\bdatetime\b/gi, "DATE")
        .replace(/\bint\b/gi, "NUMBER(10)")
        .replace(/\bvarchar\b/gi, "VARCHAR2")
        .replace(/\bnumeric\s*\((\d+),\s*(\d+)\)/gi, "NUMBER($1,$2)")
        .replace(/identity\(\d+,\s*\d+\)/gi, "")
        .replace(/GO\s*$/gim, "/");
    }
    
    // Default minimal conversion
    return sybaseCode
      .replace(/GO/g, "/")
      .replace(/\bdatetime\b/gi, "DATE")
      .replace(/\bint\b/gi, "NUMBER(10)")
      .replace(/\bvarchar\b/gi, "VARCHAR2")
      .replace(/\bnumeric\s*\((\d+),\s*(\d+)\)/gi, "NUMBER($1,$2)")
      .replace(/END$/i, "END;");
  };
  
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!file && !data.sybaseCode) {
      toast.error("Please upload a database file or enter Sybase code");
      return;
    }
    
    setIsSubmitting(true);
    toast.loading("Converting Sybase to Oracle...");
    
    try {
      let sybaseCode = data.sybaseCode || "";
      
      // If we have a file but no manual input, read the file
      if (file && !manualInput) {
        const text = await file.text();
        sybaseCode = text;
      }
      
      setOriginalCode(sybaseCode);
      
      // Convert the Sybase code to Oracle
      const oracleCode = convertSybaseToOracle(sybaseCode);
      setConvertedCode(oracleCode);
      
      // Calculate performance metrics
      const metrics = calculatePerformanceMetrics(sybaseCode, oracleCode);
      setPerformanceMetrics(metrics);
      
      setShowComparison(true);
      
      toast.dismiss();
      toast.success("Sybase code successfully converted to Oracle");
      
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred during conversion");
      console.error("Conversion error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownload = () => {
    if (!convertedCode) return;
    
    // Create a blob from the converted code
    const blob = new Blob([convertedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `oracle-${file.name}` : `oracle-converted-code.sql`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Oracle converted code downloaded");
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2 justify-end mb-2">
            <span className="text-sm text-muted-foreground">Manual Input:</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleManualInputToggle}
              className={manualInput ? "bg-primary text-primary-foreground" : ""}
            >
              {manualInput ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          <div className="grid gap-4 py-4">
            {!manualInput ? (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Upload Sybase Database File</h3>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
            ) : (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Enter Sybase Code</h3>
                <FormField
                  control={form.control}
                  name="sybaseCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your Sybase code here..."
                          className="font-mono h-40"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {showComparison && convertedCode && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  Code Comparison
                  <ArrowDown className="ml-2 h-4 w-4" />
                </h3>
                
                {/* Move Performance Metrics to top of comparison section */}
                {performanceMetrics && (
                  <div className="mb-4 p-4 border rounded-md bg-muted/30">
                    <h4 className="text-md font-medium mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-background border rounded-md text-center">
                        <p className="text-sm text-muted-foreground">Original Complexity</p>
                        <p className="text-xl font-semibold">{performanceMetrics.originalComplexity}</p>
                      </div>
                      <div className="p-3 bg-background border rounded-md text-center">
                        <p className="text-sm text-muted-foreground">Converted Complexity</p>
                        <p className="text-xl font-semibold">{performanceMetrics.convertedComplexity}</p>
                      </div>
                      <div className="p-3 bg-background border rounded-md text-center">
                        <p className="text-sm text-muted-foreground">Improvement</p>
                        <p className="text-xl font-semibold text-green-600">{performanceMetrics.performanceImprovement}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <ResizablePanelGroup
                  direction="vertical"
                  className="min-h-[400px] border rounded-md"
                >
                  <ResizablePanel defaultSize={50}>
                    <div className="p-4">
                      <h4 className="text-md font-medium mb-2">Original Sybase Code</h4>
                      <Textarea
                        value={originalCode}
                        readOnly
                        className="font-mono h-40 bg-muted"
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="p-4">
                      <h4 className="text-md font-medium mb-2">Converted Oracle Code</h4>
                      <Textarea
                        value={convertedCode}
                        readOnly
                        className="font-mono h-40 bg-muted"
                      />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-6">
            {!convertedCode ? (
              <Button 
                type="submit" 
                className="w-full max-w-md rounded-full group"
                disabled={isSubmitting || (!file && !manualInput) || (manualInput && !form.getValues("sybaseCode"))}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Converting...
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    Convert to Oracle
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleDownload}
                className="w-full max-w-md rounded-full group bg-green-600 hover:bg-green-700"
              >
                <span className="inline-flex items-center">
                  Download Oracle SQL File
                  <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                </span>
              </Button>
            )}
          </div>
          
          {!file && !manualInput && (
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Check className="w-4 h-4" />
                <span>Please upload a database file or enable manual input</span>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ConversionForm;
