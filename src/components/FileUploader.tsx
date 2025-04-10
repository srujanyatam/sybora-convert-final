
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

const FileUploader = ({ 
  onFileSelect, 
  accept = ".sql,.db,.dat,.csv,.xml", 
  maxSize = 100,
  multiple = false
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      if (multiple) {
        validateAndProcessFiles(droppedFiles);
      } else {
        validateAndProcessFile(droppedFiles[0]);
      }
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }
    
    // Check file type if accept is specified
    if (accept && accept.length > 0) {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const acceptedTypes = accept.split(',');
      
      if (!acceptedTypes.some(type => type.trim() === fileExtension || type.trim() === '*')) {
        toast.error(`Invalid file type for ${file.name}. Accepted types: ${accept}`);
        return false;
      }
    }
    
    setFiles([file]);
    onFileSelect([file]);
    toast.success(`File "${file.name}" uploaded successfully`);
    return true;
  };
  
  const validateAndProcessFiles = (filesToProcess: File[]) => {
    const validFiles: File[] = [];
    
    filesToProcess.forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }
      
      // Check file type if accept is specified
      if (accept && accept.length > 0) {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const acceptedTypes = accept.split(',');
        
        if (!acceptedTypes.some(type => type.trim() === fileExtension || type.trim() === '*')) {
          toast.error(`Invalid file type for ${file.name}. Accepted types: ${accept}`);
          return;
        }
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setFiles(validFiles);
      onFileSelect(validFiles);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        validateAndProcessFiles(Array.from(e.target.files));
      } else {
        validateAndProcessFile(e.target.files[0]);
      }
    }
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.info("File removed");
  };
  
  const handleRemoveAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileSelect([]);
    toast.info("All files removed");
  };
  
  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      
      {files.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleSelectFile}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Drag & drop your file{multiple ? 's' : ''} here</h3>
            <p className="text-sm text-muted-foreground mb-3">
              or click to browse your files
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: {accept} (Max size: {maxSize}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 bg-secondary/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium">Uploaded Files ({files.length})</h3>
            {files.length > 1 && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-background p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRemoveFile(file)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
