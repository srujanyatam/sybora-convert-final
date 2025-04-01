
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
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Download } from "lucide-react";
import { convertDatabase, generateOracleSchemaFile } from "@/lib/conversion";

const FormSchema = z.object({
  sourceType: z.string().default("sybase"),
  targetType: z.string().default("oracle"),
});

const ConversionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [convertedCode, setConvertedCode] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceType: "sybase",
      targetType: "oracle",
    },
  });
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setConvertedCode(null);
  };
  
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!file) {
      toast.error("Please upload a database file");
      return;
    }
    
    setIsSubmitting(true);
    toast.loading("Converting Sybase to Oracle...");
    
    try {
      // Process the conversion
      const result = await convertDatabase(file, {
        sourceType: data.sourceType,
        targetType: data.targetType
      });
      
      // Generate Oracle schema file
      const oracleCode = await generateOracleSchemaFile(file.name);
      setConvertedCode(oracleCode);
      
      // Store the conversion data and result in sessionStorage
      sessionStorage.setItem("conversionData", JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        ...data,
        timestamp: new Date().toISOString(),
        result: result,
        oracleCode: oracleCode
      }));
      
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
    a.download = `oracle-converted-schema.sql`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Oracle converted schema downloaded");
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Upload Sybase Database File</h3>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            {!convertedCode ? (
              <Button 
                type="submit" 
                className="w-full max-w-md rounded-full group"
                disabled={isSubmitting || !file}
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
