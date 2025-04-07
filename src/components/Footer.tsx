
import { Database } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">DB Migrate</span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Python-powered database migration
        </p>
      </div>
    </footer>
  );
};

export default Footer;
