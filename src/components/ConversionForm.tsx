
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
import { ArrowRight, Check } from "lucide-react";
import { convertDatabase } from "@/lib/conversion";

const FormSchema = z.object({
  sourceType: z.string().default("sybase"),
  targetType: z.string().default("oracle"),
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
    toast.loading("Processing your conversion request...");
    
    try {
      // Ensure that sourceType and targetType are required
      const options = {
        sourceType: data.sourceType,
        targetType: data.targetType
      };
      
      // Process the conversion
      const result = await convertDatabase(file, options);
      
      // Store the conversion data and result in sessionStorage
      sessionStorage.setItem("conversionData", JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        ...data,
        timestamp: new Date().toISOString(),
        result: result
      }));
      
      toast.dismiss();
      toast.success("Conversion process completed successfully");
      
      // Navigate to results page
      navigate("/results");
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
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Upload Database File</h3>
              <FileUploader onFileSelect={handleFileSelect} />
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
