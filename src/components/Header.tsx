
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, FileCode, Settings } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <Database className="w-6 h-6 text-primary" />
          <span>SyboraMigrate</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/features" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Features
          </Link>
          <Link 
            to="/converter" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/converter" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Converter
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/converter">
            <Button 
              className="rounded-full transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
              size="sm"
            >
              <FileCode className="w-4 h-4 mr-2" />
              Start Converting
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
