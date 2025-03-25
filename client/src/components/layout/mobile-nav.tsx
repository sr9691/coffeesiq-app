import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Home, Compass, Plus, User, ShoppingBag } from "lucide-react";

export default function MobileNav() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get the current route without parameters
  const currentRoute = location.split('/')[1] || 'home';
  
  return (
    <nav className="bg-coffee-brown text-coffee-light fixed bottom-0 left-0 right-0 md:hidden z-10">
      <div className="grid grid-cols-5 h-16">
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center justify-center space-y-1 h-full rounded-none ${
            currentRoute === '' || currentRoute === 'home' 
              ? 'text-coffee-light' 
              : 'text-coffee-light/60 hover:text-coffee-light'
          }`}
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center justify-center space-y-1 h-full rounded-none ${
            currentRoute === 'discover' 
              ? 'text-coffee-light' 
              : 'text-coffee-light/60 hover:text-coffee-light'
          }`}
          onClick={() => navigate("/discover")}
        >
          <Compass className="h-5 w-5" />
          <span className="text-xs">Discover</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center justify-center h-full rounded-none"
          onClick={() => navigate("/add-coffee")}
        >
          <div className="bg-coffee-red w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <Plus className="h-6 w-6" />
          </div>
        </Button>
        
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center justify-center space-y-1 h-full rounded-none ${
            currentRoute === 'shop' 
              ? 'text-coffee-light' 
              : 'text-coffee-light/60 hover:text-coffee-light'
          }`}
          onClick={() => navigate("/shop")}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs">Shop</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center justify-center space-y-1 h-full rounded-none ${
            currentRoute === 'profile' 
              ? 'text-coffee-light' 
              : 'text-coffee-light/60 hover:text-coffee-light'
          }`}
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </nav>
  );
}
