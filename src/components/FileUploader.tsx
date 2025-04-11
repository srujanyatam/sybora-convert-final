
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Check, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  maxSize?: number; // in MB
  multiple?: boolean;
  acceptFolders?: boolean;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  directory?: string;
  webkitdirectory?: string;
}

const FileUploader = ({ 
  onFileSelect, 
  maxSize = 100,
  multiple = false,
  acceptFolders = false
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
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
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const items = Array.from(e.dataTransfer.items);
      handleDropItems(items);
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      if (multiple) {
        validateAndProcessFiles(droppedFiles);
      } else {
        validateAndProcessFile(droppedFiles[0]);
      }
    }
  };

  const handleDropItems = async (items: DataTransferItem[]) => {
    const allFiles: File[] = [];
    const promises: Promise<void>[] = [];
    const rejectedFiles: string[] = [];

    const processEntry = async (entry: any) => {
      if (entry.isFile) {
        const promise = new Promise<void>((resolve) => {
          entry.file((file: File) => {
            if (isSqlFile(file)) {
              allFiles.push(file);
            } else {
              rejectedFiles.push(file.name);
            }
            resolve();
          });
        });
        promises.push(promise);
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const promise = new Promise<void>((resolve) => {
          reader.readEntries(async (entries: any[]) => {
            for (const subEntry of entries) {
              await processEntry(subEntry);
            }
            resolve();
          });
        });
        promises.push(promise);
      }
    };

    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
        if (entry) {
          await processEntry(entry);
        } else {
          const file = item.getAsFile();
          if (file && isSqlFile(file)) {
            allFiles.push(file);
          } else if (file) {
            rejectedFiles.push(file.name);
          }
        }
      }
    }
    
    await Promise.all(promises);

    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles.length === 1 
        ? `File "${rejectedFiles[0]}" is not a SQL file and was skipped.`
        : `${rejectedFiles.length} files were not SQL files and were skipped.`;
      toast.error(msg);
    }

    if (allFiles.length > 0) {
      setFiles(allFiles);
      onFileSelect(allFiles);
      toast.success(`${allFiles.length} valid SQL file(s) uploaded successfully`);
    } else if (rejectedFiles.length > 0) {
      toast.error("No valid SQL files found in the upload.");
    }
  };
  
  const isSqlFile = (file: File): boolean => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return fileExtension === '.sql';
  };
  
  const validateAndProcessFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }
    
    if (!isSqlFile(file)) {
      toast.error(`File "${file.name}" is not a valid SQL file.`);
      return false;
    }
    
    setFiles([file]);
    onFileSelect([file]);
    toast.success(`File "${file.name}" uploaded successfully`);
    return true;
  };
  
  const validateAndProcessFiles = (filesToProcess: File[]) => {
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];
    
    filesToProcess.forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }
      
      if (!isSqlFile(file)) {
        rejectedFiles.push(file.name);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles.length === 1 
        ? `File "${rejectedFiles[0]}" is not a SQL file and was skipped.`
        : `${rejectedFiles.length} files were not SQL files and were skipped.`;
      toast.error(msg);
    }
    
    if (validFiles.length > 0) {
      setFiles(validFiles);
      onFileSelect(validFiles);
      toast.success(`${validFiles.length} valid SQL file(s) uploaded successfully`);
    }
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleSelectFolder = () => {
    folderInputRef.current?.click();
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

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(Array.from(e.target.files));
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
    if (folderInputRef.current) folderInputRef.current.value = '';
    onFileSelect([]);
    toast.info("All files removed");
  };
  
  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".sql"
        multiple={multiple}
        className="hidden"
      />
      {acceptFolders && (
        <input
          type="file"
          ref={folderInputRef}
          onChange={handleFolderChange}
          accept=".sql"
          multiple={multiple}
          {...{ directory: "", webkitdirectory: "" } as CustomInputProps}
          className="hidden"
        />
      )}
      
      {files.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center transition-all",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Drag & drop your file{multiple ? 's' : ''} or folder here</h3>
            <p className="text-sm text-muted-foreground mb-3">
              or select using the options below
            </p>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSelectFile}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Browse Files
              </Button>
              {acceptFolders && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSelectFolder}
                  className="flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" />
                  Browse Folders
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Supported format: .sql files only (Max size: {maxSize}MB)
            </p>
            <p className="text-xs text-muted-foreground">
              Only SQL files will be processed. Other files will be skipped.
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 bg-secondary/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium">Uploaded SQL Files ({files.length})</h3>
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
