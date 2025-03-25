import { Coffee } from "@shared/schema";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import CoffeeRating from "@/components/coffee-rating";
import { useQuery } from "@tanstack/react-query";
import { getContent } from "@/lib/config";

export default function CoffeeCard({ coffee }: { coffee: Coffee }) {
  const [_, navigate] = useLocation();
  
  // Fetch reviews to calculate average rating
  const { data: reviews } = useQuery<any[]>({
    queryKey: [`/api/coffees/${coffee.id}/reviews`],
  });
  
  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  // Determine badge to display based on criteria
  const getBadge = () => {
    if (new Date(coffee.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
      return <span className="bg-coffee-red/10 text-coffee-red text-xs font-medium px-2 py-1 rounded-full">New</span>;
    }
    
    if (averageRating >= 4.5 && reviews && reviews.length >= 5) {
      return <span className="bg-coffee-green/10 text-coffee-green text-xs font-medium px-2 py-1 rounded-full">Popular</span>;
    }
    
    return null;
  };
  
  return (
    <div className="min-w-[280px] rounded-lg overflow-hidden shadow-md bg-white snap-start">
      {coffee.imageUrl ? (
        <img 
          src={coffee.imageUrl} 
          alt={coffee.name && coffee.roaster 
            ? getContent('coffee.imageAlt.coffeeImage', '{name} from {roaster}')
                .replace('{name}', coffee.name)
                .replace('{roaster}', coffee.roaster)
            : getContent('coffee.imageAlt.default', 'CoffeesIQ')} 
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-coffee-cream flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-coffee-brown/40">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
            <line x1="6" x2="6" y1="2" y2="4"></line>
            <line x1="10" x2="10" y1="2" y2="4"></line>
            <line x1="14" x2="14" y1="2" y2="4"></line>
          </svg>
          <span className="mt-2 font-bold text-coffee-brown">{getContent('app.name', 'CoffeesIQ')}</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-coffee-brown">{coffee.name}</h3>
            <p className="text-sm text-coffee-brown/70">
              {coffee.roastLevel} Roast • {coffee.origin}
              {coffee.region ? ` (${coffee.region})` : ''}
            </p>
          </div>
          {getBadge()}
        </div>
        <div className="flex items-center mt-2">
          <CoffeeRating rating={averageRating} />
          <span className="ml-2 text-sm text-coffee-brown/70">
            {averageRating.toFixed(1)} ({reviews?.length || 0})
          </span>
        </div>
        <Button 
          className="mt-3 w-full bg-coffee-cream text-coffee-brown hover:bg-coffee-cream/80 transition font-medium text-sm"
          onClick={() => navigate(`/coffee/${coffee.id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
