import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  rightContent?: React.ReactNode;
}

export default function Navbar({ 
  title = "CoffeesIQ", 
  showBack = false,
  onBack,
  showSearch = false,
  rightContent,
}: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [_, navigate] = useLocation();
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  return (
    <header className="bg-coffee-brown text-coffee-light p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack || (() => navigate("/"))}
              className="text-coffee-light mr-2 hover:bg-coffee-brown/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-serif text-2xl font-bold">{title}</h1>
        </div>
        
        {showSearch && (
          <div className="relative w-1/2 max-w-xs">
            <Input 
              type="text" 
              placeholder="Search coffees..." 
              className="w-full py-1.5 pl-3 pr-10 rounded-full text-coffee-brown text-sm focus:outline-none focus:ring-2 focus:ring-coffee-red"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-coffee-brown p-1"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {rightContent ? (
          rightContent
        ) : (
          user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-coffee-green text-white hover:bg-coffee-green/90"
              onClick={handleProfileClick}
            >
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt="Profile" 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </Button>
          )
        )}
      </div>
    </header>
  );
}
