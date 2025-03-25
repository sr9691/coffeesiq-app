import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Coffee, User, Review } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import DesktopNav from "@/components/layout/desktop-nav";
import CoffeeCard from "@/components/coffee-card";
import ReviewItem from "@/components/review-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Sliders, Filter, Coffee as CoffeeIcon } from "lucide-react";

export default function DiscoverPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRoast, setFilterRoast] = useState<string>("");
  const [filterOrigin, setFilterOrigin] = useState<string>("");
  
  // Fetch coffees
  const { data: coffees, isLoading: isLoadingCoffees } = useQuery<Coffee[]>({
    queryKey: ["/api/coffees"],
  });
  
  // Fetch reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });
  
  // Filter coffees based on search query and filters
  const filteredCoffees = coffees?.filter(coffee => {
    const matchesSearch = searchQuery 
      ? coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coffee.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coffee.origin.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesRoast = filterRoast ? coffee.roastLevel === filterRoast : true;
    const matchesOrigin = filterOrigin ? coffee.origin === filterOrigin : true;
    
    return matchesSearch && matchesRoast && matchesOrigin;
  });
  
  // Extract unique origins and roast levels for filter options
  const origins = coffees 
    ? Array.from(new Set(coffees.map(coffee => coffee.origin))).sort() 
    : [];
    
  const roastLevels = coffees 
    ? Array.from(new Set(coffees.map(coffee => coffee.roastLevel))).sort() 
    : [];
  
  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Desktop Navigation */}
      <DesktopNav />
      
      {/* Main Content Wrapper with sidebar margin on desktop */}
      <div className="md:ml-64 flex-1 flex flex-col">
        {/* Header */}
        <Navbar title="Discover" />

        {/* Main content */}
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 flex-1">
          <Tabs defaultValue="coffees" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-coffee-cream/30 mb-6">
              <TabsTrigger value="coffees" className="text-coffee-brown">Coffees</TabsTrigger>
              <TabsTrigger value="reviews" className="text-coffee-brown">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coffees">
              <div className="mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-brown/50 h-4 w-4" />
                  <Input 
                    type="text" 
                    placeholder="Search coffees..." 
                    className="pl-10 border-coffee-cream focus-visible:ring-coffee-brown"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Select 
                    value={filterRoast} 
                    onValueChange={setFilterRoast}
                  >
                    <SelectTrigger className="w-auto border-coffee-cream focus:ring-coffee-brown bg-white">
                      <CoffeeIcon className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Roast Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roast Levels</SelectItem>
                      {roastLevels.map(roast => (
                        <SelectItem key={roast} value={roast}>{roast}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filterOrigin} 
                    onValueChange={setFilterOrigin}
                  >
                    <SelectTrigger className="w-auto border-coffee-cream focus:ring-coffee-brown bg-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Origins</SelectItem>
                      {origins.map(origin => (
                        <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {(filterRoast || filterOrigin || searchQuery) && (
                    <Button 
                      variant="outline" 
                      className="border-coffee-cream text-coffee-brown"
                      onClick={() => {
                        setFilterRoast("");
                        setFilterOrigin("");
                        setSearchQuery("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
                
                {isLoadingCoffees ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white">
                        <Skeleton className="h-40 w-full" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-full mb-3" />
                          <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredCoffees?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCoffees.map(coffee => (
                      <CoffeeCard key={coffee.id} coffee={coffee} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white shadow-md">
                    <CardContent className="pt-6 pb-6 text-center">
                      <div className="flex flex-col items-center">
                        <Sliders className="h-12 w-12 text-coffee-brown/30 mb-3" />
                        <h3 className="font-serif text-lg font-semibold text-coffee-brown mb-2">
                          No coffees match your filters
                        </h3>
                        <p className="text-coffee-brown/70 mb-4">
                          Try adjusting your search criteria or clear the filters to see all coffees.
                        </p>
                        <Button 
                          className="bg-coffee-brown text-coffee-light"
                          onClick={() => {
                            setFilterRoast("");
                            setFilterOrigin("");
                            setSearchQuery("");
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-brown/50 h-4 w-4" />
                  <Input 
                    type="text" 
                    placeholder="Search reviews..." 
                    className="pl-10 border-coffee-cream focus-visible:ring-coffee-brown"
                  />
                </div>
                
                {isLoadingReviews ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="mb-4">
                      <Skeleton className="h-[150px] w-full rounded-lg" />
                    </div>
                  ))
                ) : reviews?.length ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white shadow-md">
                    <CardContent className="pt-6 pb-6 text-center">
                      <div className="flex flex-col items-center">
                        <CoffeeIcon className="h-12 w-12 text-coffee-brown/30 mb-3" />
                        <h3 className="font-serif text-lg font-semibold text-coffee-brown mb-2">
                          No reviews found
                        </h3>
                        <p className="text-coffee-brown/70 mb-4">
                          Be the first to review a coffee!
                        </p>
                        <Button className="bg-coffee-brown text-coffee-light" onClick={() => navigate("/")}>
                          Find Coffees to Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Mobile navigation */}
        <MobileNav />
      </div>
    </div>
  );
}