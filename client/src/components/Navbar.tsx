import { useState } from "react";
import { Link, useLocation } from "wouter";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to determine active link
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl md:text-3xl font-playfair font-bold text-primary">
          Warisha
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`text-darkgray hover:text-primary transition-all ${isActive("/") ? "text-primary" : ""}`}
          >
            Home
          </Link>
          <Link 
            href="/gallery" 
            className={`text-darkgray hover:text-primary transition-all ${isActive("/gallery") ? "text-primary" : ""}`}
          >
            Gallery
          </Link>
          <Link 
            href="/collectibles" 
            className={`text-darkgray hover:text-primary transition-all ${isActive("/collectibles") ? "text-primary" : ""}`}
          >
            Collectibles
          </Link>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-darkgray"
          aria-label="Toggle menu"
        >
          <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white w-full shadow-md">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link 
              href="/" 
              className={`py-2 hover:text-primary transition-all ${isActive("/") ? "text-primary" : "text-darkgray"}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/gallery" 
              className={`py-2 hover:text-primary transition-all ${isActive("/gallery") ? "text-primary" : "text-darkgray"}`}
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>
            <Link 
              href="/collectibles" 
              className={`py-2 hover:text-primary transition-all ${isActive("/collectibles") ? "text-primary" : "text-darkgray"}`}
              onClick={closeMobileMenu}
            >
              Collectibles
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
