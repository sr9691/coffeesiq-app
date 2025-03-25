import { Review, User, Coffee } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CoffeeRating from "@/components/coffee-rating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle } from "lucide-react";

export default function ReviewItem({ review }: { review: Review }) {
  const [_, navigate] = useLocation();
  
  // Fetch user who wrote the review
  const { data: reviewer, isLoading: isLoadingReviewer } = useQuery<Omit<User, "password">>({
    queryKey: [`/api/users/${review.userId}`],
  });
  
  // Fetch coffee being reviewed
  const { data: coffee, isLoading: isLoadingCoffee } = useQuery<Coffee>({
    queryKey: [`/api/coffees/${review.coffeeId}`],
  });
  
  // Format date
  const formattedDate = (date: string | Date) => {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return reviewDate.toLocaleDateString();
    }
  };
  
  const handleCoffeeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coffee) {
      navigate(`/coffee/${coffee.id}`);
    }
  };
  
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reviewer) {
      navigate(`/profile/${reviewer.id}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-start gap-3">
        {isLoadingReviewer ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <div 
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            onClick={handleUserClick}
          >
            <img 
              src={reviewer?.avatarUrl || '/images/default-avatar.svg'} 
              alt="User avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              {isLoadingReviewer ? (
                <Skeleton className="h-5 w-32 mb-1" />
              ) : (
                <h3 
                  className="font-medium text-coffee-brown cursor-pointer hover:text-coffee-red transition"
                  onClick={handleUserClick}
                >
                  {reviewer?.displayName || reviewer?.username}
                </h3>
              )}
              {isLoadingReviewer ? (
                <Skeleton className="h-3 w-20 text-xs" />
              ) : (
                <p className="text-xs text-coffee-brown/70">
                  {formattedDate(review.createdAt)}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <CoffeeRating rating={review.rating} />
            </div>
          </div>
          
          <div className="mt-1 flex items-center">
            {isLoadingCoffee ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <>
                <span 
                  className="bg-coffee-cream px-2 py-0.5 rounded text-xs font-medium text-coffee-brown cursor-pointer hover:bg-coffee-cream/70 transition"
                  onClick={handleCoffeeClick}
                >
                  {coffee?.name}
                </span>
                <span className="mx-2 text-coffee-brown/30">•</span>
                <span className="text-xs text-coffee-brown/70">
                  {coffee?.roastLevel} Roast
                  {review.brewingMethod ? ` • ${review.brewingMethod}` : ''}
                </span>
              </>
            )}
          </div>
          
          <p className="mt-2 text-sm text-coffee-brown">
            {review.review || "No review text provided."}
          </p>
          
          {review.imageUrl && (
            <div className="mt-2 max-w-xs">
              <img 
                src={review.imageUrl} 
                alt="Review" 
                className="rounded-md w-full h-auto"
              />
            </div>
          )}
          
          <div className="mt-3 flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-coffee-brown/60 text-xs flex items-center gap-1 hover:text-coffee-red hover:bg-transparent transition p-0">
              <Heart className="h-4 w-4" /> 
              <span>24</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-coffee-brown/60 text-xs flex items-center gap-1 hover:text-coffee-brown hover:bg-transparent transition p-0">
              <MessageCircle className="h-4 w-4" />
              <span>3</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
