
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Database className="w-5 h-5 text-primary" />
          <span>DB Migrate</span>
        </Link>
        
        <nav className="ml-auto flex gap-4 md:gap-6 items-center">
          <Link 
            to="/" 
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary font-medium" : "text-foreground/70"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/features" ? "text-primary font-medium" : "text-foreground/70"
            }`}
          >
            Features
          </Link>
          <Link 
            to="/converter" 
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/converter" ? "text-primary font-medium" : "text-foreground/70"
            }`}
          >
            Converter
          </Link>
          
          <Link to="/converter">
            <Button size="sm">
              Start
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
