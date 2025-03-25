import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Home,
  Compass,
  Coffee as CoffeeIcon,
  User,
  PlusCircle,
  LogOut,
  CupSoda,
  ShoppingBag
} from "lucide-react";

export default function DesktopNav() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  if (!user) return null;
  
  // Get the current route without parameters
  const currentRoute = location.split('/')[1] || 'home';
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-coffee-brown text-coffee-light h-screen fixed left-0 top-0 p-4 z-20">
      <div className="mb-8 flex items-center">
        <CupSoda className="h-8 w-8 mr-2" />
        <h1 className="font-serif text-2xl font-bold">CoffeesIQ</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        <button 
          onClick={() => navigate("/")}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition w-full text-left ${
            currentRoute === '' || currentRoute === 'home' 
              ? 'bg-coffee-red/20 text-coffee-light' 
              : 'text-coffee-light/80 hover:bg-coffee-red/10 hover:text-coffee-light'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
        
        <button 
          onClick={() => navigate("/discover")}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition w-full text-left ${
            currentRoute === 'discover' 
              ? 'bg-coffee-red/20 text-coffee-light' 
              : 'text-coffee-light/80 hover:bg-coffee-red/10 hover:text-coffee-light'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Discover</span>
        </button>
        

        
        <button 
          onClick={() => navigate("/profile")}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition w-full text-left ${
            currentRoute === 'profile' 
              ? 'bg-coffee-red/20 text-coffee-light' 
              : 'text-coffee-light/80 hover:bg-coffee-red/10 hover:text-coffee-light'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>
        
        <button 
          onClick={() => navigate("/shop")}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition w-full text-left ${
            currentRoute === 'shop' 
              ? 'bg-coffee-red/20 text-coffee-light' 
              : 'text-coffee-light/80 hover:bg-coffee-red/10 hover:text-coffee-light'
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Shop Beans</span>
        </button>
        
        <div className="border-t border-coffee-light/20 my-4 pt-4">
          <button 
            onClick={() => navigate("/add-coffee")}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-coffee-red text-white hover:bg-coffee-red/90 transition w-full text-left"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Coffee</span>
          </button>
        </div>
      </nav>
      
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-coffee-light/80 hover:text-coffee-light hover:bg-coffee-red/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
        
        <div className="flex items-center mt-4 pt-4 border-t border-coffee-light/20">
          <div className="h-8 w-8 rounded-full bg-coffee-green overflow-hidden">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName || user.username} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white font-medium">
                {(user.displayName || user.username || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="font-medium truncate">{user.displayName || user.username}</p>
            <p className="text-xs text-coffee-light/60 truncate">@{user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}