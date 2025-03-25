import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/use-auth";

export default function NotFound() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-coffee-light">
      {/* Header */}
      <Navbar showBack title="Page Not Found" onBack={() => navigate("/")} />
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md shadow-lg border-coffee-cream">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-coffee-cream/50 flex items-center justify-center mb-4">
                <Coffee className="h-10 w-10 text-coffee-brown" />
              </div>
              
              <h1 className="text-2xl font-serif font-bold text-coffee-brown mb-2">
                404 - Page Not Found
              </h1>
              
              <p className="text-coffee-brown/70 mb-6">
                We couldn't find the page you were looking for. It might have been moved or doesn't exist.
              </p>
              
              <Button 
                className="bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                onClick={() => navigate("/")}
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Only show mobile nav if user is logged in */}
      {user && <MobileNav />}
    </div>
  );
}
