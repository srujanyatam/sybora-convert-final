
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
import { ArrowRight, Check, Download, RotateCcw, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { calculatePerformanceMetrics } from "@/lib/conversionMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertSybaseToOracle } from "@/lib/conversion";

const FormSchema = z.object({
  sourceType: z.string().default("sybase"),
  targetType: z.string().default("oracle"),
  sybaseCode: z.string().optional(),
});

interface ConversionResult {
  originalCode: string;
  convertedCode: string;
  fileName: string;
  performanceMetrics: {
    originalComplexity: number;
    convertedComplexity: number;
    performanceImprovement: string;
  };
}

const ConversionForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);
  const [showUploader, setShowUploader] = useState(true);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceType: "sybase",
      targetType: "oracle",
      sybaseCode: "",
    },
  });
  
  const handleFileSelect = (selectedFiles: File[]) => {
    // Filter out non-SQL files
    const sqlFiles = selectedFiles.filter(file => file.name.toLowerCase().endsWith('.sql'));
    
    if (sqlFiles.length !== selectedFiles.length) {
      toast.error("Only SQL files are supported. Non-SQL files were removed.");
    }
    
    if (sqlFiles.length === 0) {
      toast.error("Please upload SQL files only.");
      return;
    }
    
    setFiles(sqlFiles);
    setConversionResults([]);
    setManualInput(false);
    form.setValue("sybaseCode", "");
    
    if (sqlFiles.length > 0) {
      setShowUploader(false);
    } else {
      setShowUploader(true);
    }
  };
  
  const handleManualInputToggle = () => {
    setManualInput(!manualInput);
    if (!manualInput) {
      setFiles([]);
    } else {
      form.setValue("sybaseCode", "");
    }
    setConversionResults([]);
    setShowUploader(manualInput);
  };
  
  const handleReset = () => {
    setFiles([]);
    setConversionResults([]);
    setManualInput(false);
    setSelectedResultIndex(0);
    setShowUploader(true);
    form.reset({
      sourceType: "sybase",
      targetType: "oracle",
      sybaseCode: "",
    });
    toast.success("Form has been reset");
  };
  
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (files.length === 0 && !data.sybaseCode) {
      toast.error("Please upload a database file or enter Sybase code");
      return;
    }
    
    setIsSubmitting(true);
    toast.loading("Converting Sybase to Oracle...");
    
    try {
      const results: ConversionResult[] = [];
      
      if (files.length > 0 && !manualInput) {
        for (const file of files) {
          // Check if file is SQL
          if (!file.name.toLowerCase().endsWith('.sql')) {
            toast.error(`File ${file.name} is not an SQL file and will be skipped.`);
            continue;
          }
          
          const text = await file.text();
          // Fixed: Removed the second argument
          const oracleCode = convertSybaseToOracle(text);
          
          const metrics = calculatePerformanceMetrics(text, oracleCode);
          
          results.push({
            originalCode: text,
            convertedCode: oracleCode,
            fileName: file.name,
            performanceMetrics: metrics
          });
        }
      } else if (data.sybaseCode) {
        const sybaseCode = data.sybaseCode;
        // Fixed: Removed the second argument
        const oracleCode = convertSybaseToOracle(sybaseCode);
        
        const metrics = calculatePerformanceMetrics(sybaseCode, oracleCode);
        
        results.push({
          originalCode: sybaseCode,
          convertedCode: oracleCode,
          fileName: 'Manual Input',
          performanceMetrics: metrics
        });
      }
      
      setConversionResults(results);
      setSelectedResultIndex(0);
      
      toast.dismiss();
      toast.success(`${results.length} file(s) successfully converted to Oracle`);
      
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred during conversion");
      console.error("Conversion error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownload = (index: number) => {
    if (!conversionResults[index]) return;
    
    const blob = new Blob([conversionResults[index].convertedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = conversionResults[index].fileName.includes('.') ? 
      `oracle-${conversionResults[index].fileName}` : 
      `oracle-${conversionResults[index].fileName}.sql`;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Oracle converted code downloaded");
  };
  
  const handleQuickConvert = async () => {
    const data = form.getValues();
    if (!data.sybaseCode) {
      toast.error("Please enter some Sybase code to convert");
      return;
    }
    
    setManualInput(true);
    setIsSubmitting(true);
    toast.loading("Converting Sybase to Oracle...");
    
    try {
      const sybaseCode = data.sybaseCode;
      // Fixed: Removed the second argument
      const oracleCode = convertSybaseToOracle(sybaseCode);
      
      const metrics = calculatePerformanceMetrics(sybaseCode, oracleCode);
      
      setConversionResults([{
        originalCode: sybaseCode,
        convertedCode: oracleCode,
        fileName: 'Quick Convert',
        performanceMetrics: metrics
      }]);
      
      setSelectedResultIndex(0);
      
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
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2 justify-between mb-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <div className="flex items-center gap-2">
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
          </div>
          
          <div className="grid gap-4 py-4">
            {showUploader && !manualInput ? (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Upload Sybase Database Files</h3>
                <FileUploader 
                  onFileSelect={handleFileSelect} 
                  multiple={true}
                  acceptFolders={true}
                />
              </div>
            ) : !manualInput && files.length > 0 ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Uploaded Files ({files.length})</h3>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setShowUploader(true)}
                  >
                    Change Files
                  </Button>
                </div>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="bg-secondary/30 p-3 rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : manualInput && (
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
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={handleQuickConvert}
                  disabled={isSubmitting || !form.getValues("sybaseCode")}
                >
                  Quick Convert
                </Button>
              </div>
            )}
            
            {conversionResults.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-medium flex items-center">
                    Conversion Results
                  </h3>
                </div>
                
                {conversionResults.length > 1 && (
                  <Tabs
                    defaultValue="0"
                    value={selectedResultIndex.toString()}
                    onValueChange={(value) => setSelectedResultIndex(parseInt(value))}
                    className="mb-4"
                  >
                    <TabsList className="w-full overflow-x-auto flex">
                      {conversionResults.map((result, index) => (
                        <TabsTrigger 
                          key={index} 
                          value={index.toString()} 
                          className="text-sm md:text-base font-medium px-4 py-2"
                        >
                          {result.fileName}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
                
                {conversionResults[selectedResultIndex] && (
                  <div className="mb-4 p-4 border rounded-md bg-blue-50/30 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-medium text-blue-800">Performance Analysis</h4>
                      <Button 
                        type="button"
                        onClick={() => handleDownload(selectedResultIndex)}
                        className="rounded-full group bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <span className="inline-flex items-center">
                          Download
                          <Download className="ml-1 h-4 w-4 transition-transform group-hover:translate-y-1" />
                        </span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-white border rounded-md text-center shadow-sm">
                        <p className="text-sm text-muted-foreground">Original Complexity</p>
                        <p className="text-xl font-semibold">{conversionResults[selectedResultIndex].performanceMetrics.originalComplexity}</p>
                      </div>
                      <div className="p-3 bg-white border rounded-md text-center shadow-sm">
                        <p className="text-sm text-muted-foreground">Converted Complexity</p>
                        <p className="text-xl font-semibold">{conversionResults[selectedResultIndex].performanceMetrics.convertedComplexity}</p>
                      </div>
                      <div className="p-3 bg-white border rounded-md text-center shadow-sm">
                        <p className="text-sm text-muted-foreground">Improvement</p>
                        <p className="text-xl font-semibold text-green-600">{conversionResults[selectedResultIndex].performanceMetrics.performanceImprovement}</p>
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
                      <h4 className="text-lg font-medium mb-2">Original Sybase Code</h4>
                      <Textarea
                        value={conversionResults[selectedResultIndex]?.originalCode || ''}
                        readOnly
                        className="font-mono h-40 bg-muted"
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="p-4">
                      <h4 className="text-lg font-medium mb-2">Converted Oracle Code</h4>
                      <Textarea
                        value={conversionResults[selectedResultIndex]?.convertedCode || ''}
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
            {conversionResults.length === 0 ? (
              <Button 
                type="submit" 
                className="w-full max-w-md rounded-full group"
                disabled={isSubmitting || (files.length === 0 && !manualInput) || (manualInput && !form.getValues("sybaseCode"))}
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
              conversionResults.length > 1 && (
                <Button 
                  type="button"
                  onClick={() => handleDownload(selectedResultIndex)}
                  className="w-full max-w-md rounded-full group bg-green-600 hover:bg-green-700"
                >
                  <span className="inline-flex items-center">
                    Download Current Oracle SQL File
                    <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  </span>
                </Button>
              )
            )}
          </div>
          
          {files.length === 0 && !manualInput && (
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
