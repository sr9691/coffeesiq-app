import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Coffee, Review, FlavorNote } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getContent } from "@/lib/config";

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import CoffeeRating from "@/components/coffee-rating";
import ReviewItem from "@/components/review-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CoffeeDetails() {
  const { id } = useParams<{ id: string }>();
  const coffeeId = parseInt(id);
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch coffee details
  const { data: coffee, isLoading: isLoadingCoffee } = useQuery<Coffee>({
    queryKey: [`/api/coffees/${coffeeId}`],
    enabled: !isNaN(coffeeId),
  });
  
  // Fetch reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/coffees/${coffeeId}/reviews`],
    enabled: !isNaN(coffeeId),
  });
  
  // Fetch flavor notes
  const { data: flavorNotes, isLoading: isLoadingFlavorNotes } = useQuery<FlavorNote[]>({
    queryKey: [`/api/coffees/${coffeeId}/flavor-notes`],
    enabled: !isNaN(coffeeId),
  });
  
  // Fetch favorite status
  const { data: favoriteStatus } = useQuery<{ isFavorite: boolean }>({
    queryKey: [`/api/coffees/${coffeeId}/is-favorite`],
    enabled: !isNaN(coffeeId) && !!user,
  });
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/coffees/${coffeeId}/favorite`);
      return res.json();
    },
    onSuccess: (data: { favorited: boolean }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/coffees/${coffeeId}/is-favorite`] });
      toast({
        title: data.favorited ? "Added to favorites" : "Removed from favorites",
        description: data.favorited 
          ? "This coffee has been added to your favorites." 
          : "This coffee has been removed from your favorites.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update favorites",
        description: "There was an error updating your favorites.",
        variant: "destructive",
      });
    },
  });

  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  // No longer using brewing methods
  
  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Header */}
      <Navbar 
        showBack 
        title="Coffee Details" 
        onBack={() => navigate("/")}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 flex-1">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoadingCoffee ? (
            <Skeleton className="h-56 w-full" />
          ) : coffee?.imageUrl ? (
            <img 
              src={coffee.imageUrl} 
              alt={coffee.name && coffee.roaster 
                ? getContent('coffee.imageAlt.coffeeImage', '{name} from {roaster}')
                    .replace('{name}', coffee.name)
                    .replace('{roaster}', coffee.roaster)
                : getContent('coffee.imageAlt.default', 'CoffeesIQ')} 
              className="h-56 w-full object-cover"
            />
          ) : (
            <div className="h-56 w-full bg-coffee-cream flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-coffee-brown/40">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                <line x1="6" x2="6" y1="2" y2="4"></line>
                <line x1="10" x2="10" y1="2" y2="4"></line>
                <line x1="14" x2="14" y1="2" y2="4"></line>
              </svg>
              <span className="mt-3 font-bold text-coffee-brown">{getContent('app.name', 'CoffeesIQ')}</span>
            </div>
          )}
          
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                {isLoadingCoffee ? (
                  <>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-36" />
                  </>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-coffee-brown">{coffee?.name}</h2>
                    <p className="text-coffee-brown/70">
                      {coffee?.roastLevel} Roast • {coffee?.origin}
                      {coffee?.region ? ` (${coffee.region})` : ''}
                    </p>
                  </>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className={`text-2xl ${favoriteStatus?.isFavorite ? 'text-coffee-red' : 'text-coffee-brown/50 hover:text-coffee-red'}`}
                onClick={handleToggleFavorite}
                disabled={isLoadingCoffee || toggleFavoriteMutation.isPending}
              >
                <Heart className={`h-6 w-6 ${favoriteStatus?.isFavorite ? 'fill-coffee-red' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center mt-3">
              {isLoadingReviews ? (
                <Skeleton className="h-6 w-36" />
              ) : (
                <>
                  <CoffeeRating rating={averageRating} />
                  <span className="ml-2 text-coffee-brown/70">
                    {averageRating.toFixed(1)} ({reviews?.length || 0} ratings)
                  </span>
                </>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {isLoadingCoffee ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-coffee-cream/30 p-3 rounded-lg">
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-5 w-20 mx-auto" />
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-coffee-cream/30 p-3 rounded-lg">
                    <h3 className="text-xs text-coffee-brown/70 uppercase">Origin</h3>
                    <p className="font-medium text-coffee-brown">{coffee?.origin}</p>
                  </div>
                  <div className="bg-coffee-cream/30 p-3 rounded-lg">
                    <h3 className="text-xs text-coffee-brown/70 uppercase">Process</h3>
                    <p className="font-medium text-coffee-brown">{coffee?.processMethod || "Unknown"}</p>
                  </div>
                  <div className="bg-coffee-cream/30 p-3 rounded-lg">
                    <h3 className="text-xs text-coffee-brown/70 uppercase">Roaster</h3>
                    <p className="font-medium text-coffee-brown">{coffee?.roaster}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="font-serif text-xl font-semibold text-coffee-brown mb-2">Tasting Notes</h3>
              {isLoadingCoffee ? (
                <Skeleton className="h-20 w-full mb-4" />
              ) : (
                <p className="text-coffee-brown">{coffee?.description || "No description provided."}</p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                {isLoadingFlavorNotes ? (
                  Array(5).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-20 rounded-full" />
                  ))
                ) : flavorNotes?.length ? (
                  flavorNotes.map(note => (
                    <span 
                      key={note.id} 
                      className="bg-coffee-cream/50 px-3 py-1 rounded-full text-sm font-medium text-coffee-brown"
                    >
                      {note.name}
                    </span>
                  ))
                ) : (
                  <span className="text-coffee-brown/70">No flavor notes specified.</span>
                )}
              </div>
            </div>
            
            {/* Removed brewing methods section */}
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                className="bg-coffee-brown text-coffee-light"
                disabled={isLoadingCoffee}
              >
                Shop Now
              </Button>
              <Button
                className="bg-coffee-cream text-coffee-brown hover:bg-coffee-cream/80"
                onClick={() => navigate(`/review/${coffeeId}`)}
                disabled={isLoadingCoffee}
              >
                Write Review
              </Button>
            </div>
          </div>
        </div>
        
        {/* Reviews section */}
        <section className="mt-8">
          <h3 className="font-serif text-xl font-semibold text-coffee-brown mb-4">Reviews</h3>
          
          <div className="space-y-4">
            {isLoadingReviews ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-1/3 mb-2" />
                      <Skeleton className="h-16 w-full mb-2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : reviews?.length ? (
              reviews.slice(0, 3).map(review => (
                <ReviewItem key={review.id} review={review} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-coffee-brown/70">
                No reviews yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
          
          {reviews && reviews.length > 3 && (
            <Button 
              className="mt-4 w-full py-3 text-coffee-red bg-white rounded-lg shadow-md font-medium hover:bg-gray-50"
            >
              Show All Reviews
            </Button>
          )}
        </section>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}
