
import { Link } from "react-router-dom";
import { Database, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">SyboraMigrate</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              High-efficiency Python-powered database migration solution for converting Sybase to Oracle.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/converter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Converter
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Best Practices
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col-reverse gap-4 mt-8 pt-6 border-t border-border/40 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SyboraMigrate. All rights reserved.
          </p>
          
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
