import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User, Review } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import ReviewItem from "@/components/review-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, User as UserIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SocialPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // Fetch following
  const { data: following, isLoading: isLoadingFollowing } = useQuery<Omit<User, "password">[]>({
    queryKey: [`/api/users/${user?.id}/following`],
    enabled: !!user,
  });
  
  // Fetch followers
  const { data: followers, isLoading: isLoadingFollowers } = useQuery<Omit<User, "password">[]>({
    queryKey: [`/api/users/${user?.id}/followers`],
    enabled: !!user,
  });
  
  // Fetch feed (reviews from people user is following)
  const { data: feedReviews, isLoading: isLoadingFeed } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    enabled: !!user,
  });

  // Filter reviews to only show those from users the current user follows
  const followingIds = following?.map(f => f.id) || [];
  const filteredFeed = feedReviews?.filter(review => 
    followingIds.includes(review.userId)
  ) || [];
  
  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Header */}
      <Navbar title="Social" />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 flex-1">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-coffee-cream/30 mb-6">
            <TabsTrigger value="feed" className="text-coffee-brown">Feed</TabsTrigger>
            <TabsTrigger value="following" className="text-coffee-brown">Following</TabsTrigger>
            <TabsTrigger value="followers" className="text-coffee-brown">Followers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed">
            <div className="mb-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-brown/50 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search reviews..." 
                  className="pl-10 border-coffee-cream focus-visible:ring-coffee-brown"
                />
              </div>
              
              {isLoadingFeed ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="mb-4">
                    <Skeleton className="h-[150px] w-full rounded-lg" />
                  </div>
                ))
              ) : filteredFeed.length > 0 ? (
                <div className="space-y-4">
                  {filteredFeed.map(review => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card className="bg-white shadow-md">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="flex flex-col items-center">
                      <UserPlus className="h-12 w-12 text-coffee-brown/30 mb-3" />
                      <h3 className="font-serif text-lg font-semibold text-coffee-brown mb-2">
                        Your feed is empty
                      </h3>
                      <p className="text-coffee-brown/70 mb-4">
                        Follow coffee enthusiasts to see their reviews and activity in your feed.
                      </p>
                      <Button className="bg-coffee-brown text-coffee-light" onClick={() => navigate("/discover")}>
                        Discover Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="following">
            <div className="mb-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-brown/50 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search following..." 
                  className="pl-10 border-coffee-cream focus-visible:ring-coffee-brown"
                />
              </div>
              
              {isLoadingFollowing ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="mb-4 flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))
              ) : following?.length ? (
                <div className="space-y-4">
                  {following.map(followedUser => (
                    <div key={followedUser.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                        <img 
                          src={followedUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(followedUser.displayName || followedUser.username)}&background=9E2B25&color=fff`} 
                          alt={followedUser.username}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-coffee-brown">
                          {followedUser.displayName || followedUser.username}
                        </h3>
                        <p className="text-sm text-coffee-brown/70">@{followedUser.username}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                        onClick={() => navigate(`/profile/${followedUser.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-white shadow-md">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="flex flex-col items-center">
                      <UserPlus className="h-12 w-12 text-coffee-brown/30 mb-3" />
                      <h3 className="font-serif text-lg font-semibold text-coffee-brown mb-2">
                        You're not following anyone yet
                      </h3>
                      <p className="text-coffee-brown/70 mb-4">
                        Follow coffee enthusiasts to see their reviews and activity in your feed.
                      </p>
                      <Button className="bg-coffee-brown text-coffee-light" onClick={() => navigate("/discover")}>
                        Discover Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="followers">
            <div className="mb-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-brown/50 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search followers..." 
                  className="pl-10 border-coffee-cream focus-visible:ring-coffee-brown"
                />
              </div>
              
              {isLoadingFollowers ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="mb-4 flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))
              ) : followers?.length ? (
                <div className="space-y-4">
                  {followers.map(follower => (
                    <div key={follower.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                        <img 
                          src={follower.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.displayName || follower.username)}&background=9E2B25&color=fff`} 
                          alt={follower.username}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-coffee-brown">
                          {follower.displayName || follower.username}
                        </h3>
                        <p className="text-sm text-coffee-brown/70">@{follower.username}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                        onClick={() => navigate(`/profile/${follower.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-white shadow-md">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="flex flex-col items-center">
                      <UserIcon className="h-12 w-12 text-coffee-brown/30 mb-3" />
                      <h3 className="font-serif text-lg font-semibold text-coffee-brown mb-2">
                        You don't have any followers yet
                      </h3>
                      <p className="text-coffee-brown/70 mb-4">
                        As you interact with the community, people may start following you.
                      </p>
                      <Button className="bg-coffee-brown text-coffee-light" onClick={() => navigate("/discover")}>
                        Discover Users
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
  );
}
