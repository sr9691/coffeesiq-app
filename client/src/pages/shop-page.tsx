import { useLocation } from "wouter";
import { ExternalLink, ShoppingBag, Coffee } from "lucide-react";

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import DesktopNav from "@/components/layout/desktop-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ShopPage() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // External shop link
  const externalShopUrl = "https://www.example.com/coffeeshop";
  
  const handleExternalLink = () => {
    // In a real app, we would use window.open(externalShopUrl, '_blank')
    // But for demo purposes, we'll just show a toast
    toast({
      title: "External Shop",
      description: "In a production app, this would open our Shopify store",
    });
  };

  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Desktop Navigation */}
      <DesktopNav />
      
      {/* Header */}
      <Navbar title="Shop Beans" />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 flex-1 flex flex-col items-center justify-center">
        <Card className="max-w-2xl w-full bg-white shadow-md">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="flex flex-col items-center">
              <Coffee className="h-16 w-16 text-coffee-brown mb-6" />
              <h1 className="font-serif text-3xl font-semibold text-coffee-brown mb-4">
                CoffeesIQ Shop
              </h1>
              <p className="text-coffee-brown/70 mb-6 max-w-md">
                Our coffee shop is hosted on a separate platform where you can browse and purchase our carefully selected beans.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  className="bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90 flex items-center gap-2"
                  onClick={handleExternalLink}
                >
                  <ShoppingBag size={18} />
                  Visit Our Shop
                  <ExternalLink size={16} className="ml-1" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-coffee-cream text-coffee-brown hover:bg-coffee-cream/20"
                  onClick={() => navigate("/")}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}