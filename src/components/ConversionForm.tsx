
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import FileUploader from "./FileUploader";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const FormSchema = z.object({
  sourceType: z.string({
    required_error: "Please select a source database type",
  }),
  sourceVersion: z.string({
    required_error: "Please select a source version",
  }),
  targetType: z.string({
    required_error: "Please select a target database type",
  }),
  targetVersion: z.string({
    required_error: "Please select a target version",
  }),
  sourceCharset: z.string().optional(),
  targetCharset: z.string().optional(),
  validateData: z.boolean().default(true),
  generateReport: z.boolean().default(true),
  optimizeForLargeData: z.boolean().default(false),
  preserveIdentifiers: z.boolean().default(true),
});

const ConversionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceType: "sybase",
      targetType: "oracle",
      validateData: true,
      generateReport: true,
      optimizeForLargeData: false,
      preserveIdentifiers: true,
    },
  });
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };
  
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!file) {
      toast.error("Please upload a database file");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate processing
    toast.loading("Processing your conversion request...");
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.success("Conversion process started successfully");
      
      // Store the conversion data in sessionStorage
      sessionStorage.setItem("conversionData", JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        ...data,
        timestamp: new Date().toISOString(),
      }));
      
      // Navigate to results page
      navigate("/results");
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Upload Database File</h3>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-4">Source Database</h3>
                
                <FormField
                  control={form.control}
                  name="sourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select database type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sybase">Sybase</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sourceVersion"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Version</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select version" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ase-15.7">ASE 15.7</SelectItem>
                          <SelectItem value="ase-16.0">ASE 16.0</SelectItem>
                          <SelectItem value="ase-16.5">ASE 16.5</SelectItem>
                          <SelectItem value="iq-16.0">IQ 16.0</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sourceCharset"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Character Set (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., UTF-8, ISO-8859-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Target Database</h3>
                
                <FormField
                  control={form.control}
                  name="targetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select database type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="oracle">Oracle</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetVersion"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Version</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select version" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12c">12c</SelectItem>
                          <SelectItem value="19c">19c</SelectItem>
                          <SelectItem value="21c">21c</SelectItem>
                          <SelectItem value="23c">23c</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetCharset"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Character Set (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AL32UTF8, WE8ISO8859P1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Conversion Options</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="validateData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Validate Data Integrity</FormLabel>
                        <FormDescription>
                          Verify data values match after conversion
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="generateReport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Generate Conversion Report</FormLabel>
                        <FormDescription>
                          Create detailed report of all conversions performed
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="optimizeForLargeData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Optimize for Large Datasets</FormLabel>
                        <FormDescription>
                          Use batch processing and memory optimization techniques
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preserveIdentifiers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Preserve Identifiers</FormLabel>
                        <FormDescription>
                          Keep table and column names unchanged when possible
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              type="submit" 
              className="w-full max-w-md rounded-full group"
              disabled={isSubmitting || !file}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  Start Conversion
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </div>
          
          {!file && (
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Check className="w-4 h-4" />
                <span>Please upload a database file to continue</span>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ConversionForm;
