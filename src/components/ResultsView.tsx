
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Download, FileText, AlertTriangle, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ConversionData {
  fileName: string;
  fileSize: number;
  sourceType: string;
  sourceVersion: string;
  targetType: string;
  targetVersion: string;
  timestamp: string;
  [key: string]: any;
}

const ResultsView = () => {
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'running' | 'completed' | 'error'>('running');
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Get conversion data from sessionStorage
    const storedData = sessionStorage.getItem("conversionData");
    if (storedData) {
      setConversionData(JSON.parse(storedData));
    }
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          generateMockResults();
          return 100;
        }
        return prev + 5;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateMockResults = () => {
    // Generate mock results data
    setResults({
      tables: {
        converted: 23,
        total: 24,
        details: [
          { name: "CUSTOMERS", status: "success", rows: 15243 },
          { name: "ORDERS", status: "success", rows: 42891 },
          { name: "PRODUCTS", status: "success", rows: 1254 },
          { name: "INVENTORY", status: "success", rows: 2458 },
          { name: "EMPLOYEES", status: "success", rows: 314 },
          { name: "SUPPLIERS", status: "success", rows: 89 },
          { name: "ORDER_ITEMS", status: "success", rows: 86452 },
          { name: "SHIPPING", status: "warning", rows: 12841, warnings: 3 },
        ]
      },
      stored_procedures: {
        converted: 12,
        total: 15,
        details: [
          { name: "sp_get_customer", status: "success" },
          { name: "sp_update_inventory", status: "success" },
          { name: "sp_process_order", status: "warning", issues: ["Cursor logic modified"] },
          { name: "sp_generate_report", status: "error", issues: ["Unsupported temp table usage"] },
        ]
      },
      triggers: {
        converted: 8,
        total: 10,
        details: [
          { name: "trg_order_update", status: "success" },
          { name: "trg_inventory_check", status: "warning", issues: ["Transaction isolation modified"] },
        ]
      },
      performance: {
        duration: "00:03:24",
        memory_peak: "512MB",
        rows_processed: 161542,
      }
    });
  };
  
  const handleDownload = () => {
    toast.success("Conversion package prepared for download");
    setTimeout(() => {
      toast("Starting download...");
    }, 1000);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link");
      });
  };
  
  if (!conversionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-xl font-medium mb-2">No conversion data</h3>
        <p className="text-muted-foreground text-center mb-4">
          Please start a new conversion to see results here.
        </p>
        <Button asChild>
          <a href="/converter">Start New Conversion</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
      <Card className="overflow-hidden">
        <CardHeader className="bg-background border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conversion Results</CardTitle>
              <CardDescription>
                {conversionData.sourceType.toUpperCase()} {conversionData.sourceVersion} to {conversionData.targetType.toUpperCase()} {conversionData.targetVersion}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {status === 'completed' && (
                <>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Conversion Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex items-center mt-4">
              <div className={cn(
                "text-xs rounded-full px-2 py-1 font-medium",
                status === 'running' ? "bg-primary/20 text-primary" :
                status === 'completed' ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              )}>
                {status === 'running' ? "Processing" : 
                 status === 'completed' ? "Completed" : "Error"}
              </div>
              
              {status === 'completed' && (
                <span className="text-xs text-muted-foreground ml-3">
                  Processed {conversionData.fileName} ({(conversionData.fileSize / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>
          </div>
          
          {status === 'completed' && results && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tables">Tables</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Tables</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.tables.converted}/{results.tables.total}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((results.tables.converted / results.tables.total) * 100)}% converted
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Procedures</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.stored_procedures.converted}/{results.stored_procedures.total}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((results.stored_procedures.converted / results.stored_procedures.total) * 100)}% converted
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Rows</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.performance.rows_processed.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        Processed successfully
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.performance.duration}</div>
                      <div className="text-xs text-muted-foreground">
                        Total process time
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Source Database</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Type</span>
                              <span className="text-xs font-medium">{conversionData.sourceType.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Version</span>
                              <span className="text-xs font-medium">{conversionData.sourceVersion}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Charset</span>
                              <span className="text-xs font-medium">{conversionData.sourceCharset || "Default"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Target Database</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Type</span>
                              <span className="text-xs font-medium">{conversionData.targetType.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Version</span>
                              <span className="text-xs font-medium">{conversionData.targetVersion}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Charset</span>
                              <span className="text-xs font-medium">{conversionData.targetCharset || "Default"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Options Used</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${conversionData.validateData ? "bg-green-500" : "bg-gray-300"}`}></div>
                            <span className="text-xs">Data Validation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${conversionData.generateReport ? "bg-green-500" : "bg-gray-300"}`}></div>
                            <span className="text-xs">Report Generation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${conversionData.optimizeForLargeData ? "bg-green-500" : "bg-gray-300"}`}></div>
                            <span className="text-xs">Large Data Optimization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${conversionData.preserveIdentifiers ? "bg-green-500" : "bg-gray-300"}`}></div>
                            <span className="text-xs">Preserve Identifiers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tables" className="space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Table Conversion</CardTitle>
                    <CardDescription>
                      {results.tables.converted} of {results.tables.total} tables converted successfully
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-xs font-medium text-left p-3">Table Name</th>
                            <th className="text-xs font-medium text-left p-3">Status</th>
                            <th className="text-xs font-medium text-right p-3">Rows</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.tables.details.map((table: any, index: number) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                              <td className="p-3 text-sm font-medium">{table.name}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  {table.status === 'success' ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : table.status === 'warning' ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className="text-sm">{table.status === 'success' ? 'OK' : 'Issues'}</span>
                                  {table.warnings && (
                                    <span className="text-xs text-muted-foreground">({table.warnings} warnings)</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-sm text-right">{table.rows.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="procedures" className="space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Stored Procedures</CardTitle>
                    <CardDescription>
                      {results.stored_procedures.converted} of {results.stored_procedures.total} procedures converted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-xs font-medium text-left p-3">Procedure Name</th>
                            <th className="text-xs font-medium text-left p-3">Status</th>
                            <th className="text-xs font-medium text-left p-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.stored_procedures.details.map((proc: any, index: number) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                              <td className="p-3 text-sm font-medium">{proc.name}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  {proc.status === 'success' ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : proc.status === 'warning' ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className="text-sm">{proc.status.charAt(0).toUpperCase() + proc.status.slice(1)}</span>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">
                                {proc.issues ? proc.issues.join(", ") : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Triggers</CardTitle>
                    <CardDescription>
                      {results.triggers.converted} of {results.triggers.total} triggers converted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-xs font-medium text-left p-3">Trigger Name</th>
                            <th className="text-xs font-medium text-left p-3">Status</th>
                            <th className="text-xs font-medium text-left p-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.triggers.details.map((trigger: any, index: number) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                              <td className="p-3 text-sm font-medium">{trigger.name}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  {trigger.status === 'success' ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : trigger.status === 'warning' ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className="text-sm">{trigger.status.charAt(0).toUpperCase() + trigger.status.slice(1)}</span>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">
                                {trigger.issues ? trigger.issues.join(", ") : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="issues" className="space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Issues</CardTitle>
                    <CardDescription>
                      Potential problems requiring attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-800">Unsupported temp table usage in procedure</h4>
                            <p className="text-xs text-amber-700 mt-1">
                              Procedure <code className="text-xs bg-amber-100 px-1 py-0.5 rounded">sp_generate_report</code> uses temporary tables with Sybase-specific syntax. This has been converted to use Oracle global temporary tables, but the semantics may differ.
                            </p>
                            <div className="mt-2 text-xs">
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-800">Transaction isolation level differences</h4>
                            <p className="text-xs text-amber-700 mt-1">
                              Trigger <code className="text-xs bg-amber-100 px-1 py-0.5 rounded">trg_inventory_check</code> uses a transaction isolation level that doesn't have a direct equivalent in Oracle. The closest match has been used, but behavior may differ.
                            </p>
                            <div className="mt-2 text-xs">
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-800">Cursor behavior differences</h4>
                            <p className="text-xs text-amber-700 mt-1">
                              Procedure <code className="text-xs bg-amber-100 px-1 py-0.5 rounded">sp_process_order</code> uses cursors with Sybase-specific features. The Oracle conversion may behave differently in edge cases.
                            </p>
                            <div className="mt-2 text-xs">
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/30 border-t p-4 flex justify-between">
          <div className="text-xs text-muted-foreground">
            Conversion started on {new Date(conversionData.timestamp).toLocaleString()}
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/converter">Start New Conversion</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsView;
