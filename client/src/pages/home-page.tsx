import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Coffee, Review } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import DesktopNav from "@/components/layout/desktop-nav";
import CoffeeCard from "@/components/coffee-card";
import ReviewItem from "@/components/review-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Coffee as CoffeeIcon, Target, Leaf } from "lucide-react";

import MascotButton from "@/components/mascot/mascot-button";
import { useMascot } from "@/components/mascot/mascot-context";

export default function HomePage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { currentPathVisited } = useMascot();
  
  // Mark this page as visited for the mascot guide
  useEffect(() => {
    currentPathVisited();
  }, [currentPathVisited]);

  // Fetch featured coffees
  const { data: featuredCoffees, isLoading: isLoadingCoffees } = useQuery<Coffee[]>({
    queryKey: ["/api/coffees"],
  });



  // Fetch recent reviews
  const { data: recentReviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Desktop Navigation */}
      <DesktopNav />
      
      {/* Header with search */}
      <Navbar />

      {/* Main content */}
      <main className="container md:ml-64 mx-auto px-4 py-6 pb-20 md:pb-6 flex-1">
        {/* Featured section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-semibold text-coffee-brown">Featured Coffees</h2>
            <Button 
              variant="link" 
              className="text-coffee-red text-sm font-medium p-0"
              onClick={() => navigate("/discover")}
            >
              See all
            </Button>
          </div>
          
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {isLoadingCoffees ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="min-w-[280px] rounded-lg overflow-hidden shadow-md bg-white snap-start">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </div>
                ))
              ) : featuredCoffees?.length ? (
                featuredCoffees.map((coffee) => (
                  <CoffeeCard key={coffee.id} coffee={coffee} />
                ))
              ) : (
                <div className="w-full text-center py-8 text-coffee-brown/70">
                  No coffees found. Start by adding some!
                </div>
              )}
            </div>
          </div>
        </section>
        

        {/* Coffee Quiz Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-semibold text-coffee-brown">Find Your Perfect Match</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-3/5 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-coffee-green flex items-center justify-center text-coffee-light">
                    <Target size={20} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-coffee-brown">Coffee Preference Quiz</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Not sure which coffee to try next? Take our interactive quiz to discover beans that match your unique taste preferences.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-coffee-cream text-coffee-brown">
                    <Leaf size={12} className="mr-1" /> Flavor Profiles
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-coffee-cream text-coffee-brown">
                    Origin Regions
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-coffee-cream text-coffee-brown">
                    Roast Levels
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-coffee-cream text-coffee-brown">
                    Brewing Methods
                  </span>
                </div>
                
                <Button 
                  className="bg-coffee-green hover:bg-coffee-green/90 text-coffee-light"
                  onClick={() => navigate("/quiz")}
                >
                  Take the Quiz
                </Button>
              </div>
              
              <div className="md:w-2/5 bg-coffee-brown p-5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 text-coffee-light">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 8c0 3.3 2.7 6 6 6 0-3.3-2.7-6-6-6zm0 8c4.4 0 8-3.6 8-8-4.4 0-8 3.6-8 8z" />
                      <path d="M22 8c0 3.3-2.7 6-6 6 0-3.3 2.7-6 6-6zm0 8c-4.4 0-8-3.6-8-8 4.4 0 8 3.6 8 8z" />
                    </svg>
                  </div>
                  <p className="text-coffee-light font-medium">5 Questions</p>
                  <p className="text-coffee-light/70 text-sm">Takes about 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recent reviews section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-coffee-brown">Recent Reviews</h2>
              <MascotButton 
                tooltipText="Coffee tasting tips!" 
                mood="thinking" 
                tipsType="tasting" 
              />
            </div>
            <Button 
              variant="link" 
              className="text-coffee-red text-sm font-medium p-0"
              onClick={() => navigate("/discover")}
            >
              See all
            </Button>
          </div>
          
          <div className="space-y-4">
            {isLoadingReviews ? (
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-1/3 mb-3" />
                      <Skeleton className="h-16 w-full mb-2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : recentReviews?.length ? (
              recentReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-coffee-brown/70">
                No reviews yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </section>
        
        {/* Your coffee journey */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-semibold text-coffee-brown">Your Coffee Journey</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="h-16 w-16 bg-coffee-brown rounded-full flex items-center justify-center mb-2">
                <span className="font-serif text-coffee-light text-2xl">
                  {isLoadingReviews ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    recentReviews?.filter(review => review.userId === user?.id).length || 0
                  )}
                </span>
              </div>
              <h3 className="font-medium text-coffee-brown">Coffees Rated</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-coffee-cream/50 p-3 rounded-lg text-center">
                <div className="font-serif text-xl text-coffee-brown">
                  {isLoadingCoffees ? (
                    <Skeleton className="h-6 w-6 mx-auto" />
                  ) : (
                    0 // Will be replaced with actual favorite count
                  )}
                </div>
                <p className="text-sm text-coffee-brown/70">Favorites</p>
              </div>
              <div className="bg-coffee-cream/50 p-3 rounded-lg text-center">
                <div className="font-serif text-xl text-coffee-brown">
                  {isLoadingCoffees ? (
                    <Skeleton className="h-6 w-6 mx-auto" />
                  ) : (
                    new Set(featuredCoffees?.map(coffee => coffee.origin)).size || 0
                  )}
                </div>
                <p className="text-sm text-coffee-brown/70">Countries</p>
              </div>
              <div className="bg-coffee-cream/50 p-3 rounded-lg text-center">
                <div className="font-serif text-xl text-coffee-brown">
                  {isLoadingCoffees ? (
                    <Skeleton className="h-6 w-6 mx-auto" />
                  ) : (
                    new Set(featuredCoffees?.map(coffee => coffee.roaster)).size || 0
                  )}
                </div>
                <p className="text-sm text-coffee-brown/70">Roasters</p>
              </div>
              <div className="bg-coffee-cream/50 p-3 rounded-lg text-center">
                <div className="font-serif text-xl text-coffee-brown">
                  {isLoadingCoffees ? (
                    <Skeleton className="h-6 w-6 mx-auto" />
                  ) : (
                    new Set(featuredCoffees?.map(coffee => coffee.roastLevel)).size || 0
                  )}
                </div>
                <p className="text-sm text-coffee-brown/70">Roast Levels</p>
              </div>
            </div>
            
            <Button 
              className="mt-4 w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
              onClick={() => navigate("/profile")}
            >
              View Your Journey
            </Button>
          </div>
        </section>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}
