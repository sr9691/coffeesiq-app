import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { User, Collection, Review, Coffee } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import DesktopNav from "@/components/layout/desktop-nav";
import CoffeeCard from "@/components/coffee-card";
import ReviewItem from "@/components/review-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  Star,
  Heart,
  Coffee as CoffeeIcon,
  Edit,
  Plus,
  UserPlus,
  Clock,
  X
} from "lucide-react";

// Define the profile form schema
const profileFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name cannot exceed 50 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal(""))
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // State for edit profile dialog
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Determine if this is the current user's profile or another user's
  const isCurrentUser = !id || parseInt(id) === user?.id;
  const userId = isCurrentUser ? user?.id : parseInt(id);
  
  // Fetch user data if looking at someone else's profile
  const { data: profileUser, isLoading: isLoadingUser } = useQuery<Omit<User, "password">>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId && !isCurrentUser,
  });
  
  // Fetch user's coffees
  const { data: userCoffees, isLoading: isLoadingCoffees } = useQuery<Coffee[]>({
    queryKey: [`/api/users/${userId}/coffees`],
    enabled: !!userId,
  });
  
  // Fetch user's reviews
  const { data: userReviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/users/${userId}/reviews`],
    enabled: !!userId,
  });
  
  // Fetch user's collections
  const { data: userCollections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: [`/api/users/${userId}/collections`],
    enabled: !!userId,
  });
  
  // Fetch following/followers count
  const { data: following } = useQuery<Omit<User, "password">[]>({
    queryKey: [`/api/users/${userId}/following`],
    enabled: !!userId,
  });
  
  const { data: followers } = useQuery<Omit<User, "password">[]>({
    queryKey: [`/api/users/${userId}/followers`],
    enabled: !!userId,
  });
  
  // Check if current user is following profile user
  const { data: followStatus } = useQuery<{ isFollowing: boolean }>({
    queryKey: [`/api/users/${userId}/is-following`],
    enabled: !!userId && !isCurrentUser && !!user,
  });
  
  // Follow/unfollow mutation
  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/users/${userId}/follow`);
      return res.json();
    },
    onSuccess: (data: { following: boolean }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/is-following`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/followers`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/following`] });
      
      toast({
        title: data.following ? "Followed successfully" : "Unfollowed successfully",
        description: data.following 
          ? `You are now following ${profileUser?.displayName || profileUser?.username || 'this user'}.` 
          : `You have unfollowed ${profileUser?.displayName || profileUser?.username || 'this user'}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    },
  });
  
  // Upload avatar mutation
  const [isUploading, setIsUploading] = useState(false);
  
  // Setup form for profile editing
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      bio: user?.bio || ""
    }
  });
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        bio: user.bio || ""
      });
    }
  }, [user, form]);
  
  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditProfileOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });
  
  const handleEditProfile = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };
  
  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}`, {
        avatarUrl
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      
      toast({
        title: "Profile updated",
        description: "Your profile photo has been updated successfully.",
      });
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile photo.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create an image to resize it if needed
    const img = new Image();
    const reader = new FileReader();
    
    reader.onloadend = () => {
      img.src = reader.result as string;
      
      img.onload = () => {
        // Resize image if it's too large
        const maxWidth = 400;
        const maxHeight = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          } else {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        // Create canvas to resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality (0.7 quality)
          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          
          // Submit the optimized image
          updateAvatarMutation.mutate(base64String);
        } else {
          // Fallback if canvas context fails
          updateAvatarMutation.mutate(reader.result as string);
        }
      };
      
      img.onerror = () => {
        toast({
          title: "Error",
          description: "There was an error processing your image",
          variant: "destructive",
        });
        setIsUploading(false);
      };
    };
    
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "There was an error reading your image",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleToggleFollow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    toggleFollowMutation.mutate();
  };
  
  // Determine display name
  const displayName = isCurrentUser 
    ? (user?.displayName || user?.username || "You") 
    : (profileUser?.displayName || profileUser?.username || "User");
  
  // Calculate stats
  const reviewCount = userReviews?.length || 0;
  const countriesCount = userCoffees ? new Set(userCoffees.map(coffee => coffee.origin)).size : 0;
  const followingCount = following?.length || 0;
  const followersCount = followers?.length || 0;
  
  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Desktop Navigation */}
      <DesktopNav />
      
      {/* Main Content Wrapper with sidebar margin on desktop */}
      <div className="md:ml-64 flex-1 flex flex-col">
        {/* Header */}
        <Navbar 
          showBack 
          title="Profile" 
          onBack={() => navigate("/")}
        />

        {/* Main content */}
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 flex-1">
          {/* Profile header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="h-32 bg-coffee-cream relative">
              <div className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-4 border-white overflow-hidden">
                {isLoadingUser ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <img 
                    src={isCurrentUser 
                      ? user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=9E2B25&color=fff`
                      : profileUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=9E2B25&color=fff`
                    } 
                    alt="Profile avatar" 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="pt-14 px-4 pb-5">
              <div className="flex justify-between items-start">
                <div>
                  {isLoadingUser && !isCurrentUser ? (
                    <>
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <h2 className="font-serif text-xl font-bold text-coffee-brown">{displayName}</h2>
                      <p className="text-coffee-brown/70">@{isCurrentUser ? user?.username : profileUser?.username}</p>
                    </>
                  )}
                </div>
                {isCurrentUser ? (
                  <div className="flex gap-2">
                    <label 
                      htmlFor="avatarUpload" 
                      className={`cursor-pointer ${isUploading ? 'bg-gray-400' : 'bg-coffee-red'} px-4 py-1.5 rounded-full text-sm font-medium text-white flex items-center`}
                    >
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-1" /> Change Photo
                        </>
                      )}
                      <input 
                        id="avatarUpload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <Button 
                      className="bg-coffee-cream px-4 py-1.5 rounded-full text-sm font-medium text-coffee-brown"
                      onClick={() => setIsEditProfileOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit Profile
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      followStatus?.isFollowing 
                        ? 'bg-coffee-brown text-coffee-light' 
                        : 'bg-coffee-cream text-coffee-brown'
                    }`}
                    onClick={handleToggleFollow}
                    disabled={toggleFollowMutation.isPending}
                  >
                    {followStatus?.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
              <p className="mt-3 text-coffee-brown">
                {isLoadingUser && !isCurrentUser ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  profileUser?.bio || 'Coffee enthusiast and home barista. Always hunting for the perfect cup!'
                )}
              </p>
              <div className="mt-4 flex gap-6">
                <div className="text-center">
                  <div className="font-medium text-coffee-brown">{reviewCount}</div>
                  <p className="text-xs text-coffee-brown/70">Reviews</p>
                </div>
                <div className="text-center">
                  <div className="font-medium text-coffee-brown">{followingCount}</div>
                  <p className="text-xs text-coffee-brown/70">Following</p>
                </div>
                <div className="text-center">
                  <div className="font-medium text-coffee-brown">{followersCount}</div>
                  <p className="text-xs text-coffee-brown/70">Followers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coffee Stats */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <h3 className="font-serif text-lg font-semibold text-coffee-brown mb-4">Coffee Journey</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-coffee-cream/30 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs text-coffee-brown/70 uppercase">Coffees Tried</h4>
                    {isLoadingReviews ? 
                      <Skeleton className="h-6 w-6" /> 
                      : 
                      <p className="font-serif text-xl text-coffee-brown">
                        {reviewCount}
                      </p>
                    }
                  </div>
                  <CoffeeIcon className="text-coffee-brown/30 h-6 w-6" />
                </div>
              </div>
              <div className="bg-coffee-cream/30 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs text-coffee-brown/70 uppercase">Countries</h4>
                    {isLoadingCoffees ? 
                      <Skeleton className="h-6 w-6" /> 
                      : 
                      <p className="font-serif text-xl text-coffee-brown">
                        {countriesCount}
                      </p>
                    }
                  </div>
                  <Globe className="text-coffee-brown/30 h-6 w-6" />
                </div>
              </div>
              <div className="bg-coffee-cream/30 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs text-coffee-brown/70 uppercase">Avg. Rating</h4>
                    {isLoadingReviews ? (
                      <Skeleton className="h-6 w-6" />
                    ) : (
                      <p className="font-serif text-xl text-coffee-brown">
                        {userReviews?.length 
                          ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                          : "0.0"
                        }
                      </p>
                    )}
                  </div>
                  <Star className="text-coffee-brown/30 h-6 w-6" />
                </div>
              </div>
              <div className="bg-coffee-cream/30 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs text-coffee-brown/70 uppercase">Favorites</h4>
                    {isLoadingCoffees ? 
                      <Skeleton className="h-6 w-6" /> 
                      : 
                      <p className="font-serif text-xl text-coffee-brown">
                        0
                      </p>
                    }
                  </div>
                  <Heart className="text-coffee-brown/30 h-6 w-6" />
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-coffee-cream text-coffee-brown hover:bg-coffee-cream/80">
              View Detailed Stats
            </Button>
          </div>
          
          {/* Recent Activity */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-semibold text-coffee-brown">Recent Activity</h3>
              <Button variant="link" className="text-coffee-red text-sm font-medium p-0">
                View All
              </Button>
            </div>
            
            {isLoadingReviews ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex items-start">
                    <Skeleton className="h-6 w-6 rounded-full mr-3 mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : userReviews?.length ? (
              <div className="space-y-4">
                {userReviews.slice(0, 3).map(review => (
                  <div key={review.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start">
                      <Star className="text-coffee-red h-5 w-5 mt-1 mr-3" />
                      <div className="flex-1">
                        <p className="text-coffee-brown">
                          <span className="font-medium">
                            {isCurrentUser ? 'You' : displayName} rated
                          </span> a coffee {review.rating} out of 5
                        </p>
                        <p className="text-xs text-coffee-brown/70 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-coffee-brown/70">
                No activity yet.
              </div>
            )}
          </div>
          
          {/* Collections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-semibold text-coffee-brown">Collections</h3>
              {isCurrentUser && (
                <Button variant="link" className="text-coffee-red text-sm font-medium p-0">
                  Create New
                </Button>
              )}
            </div>
            
            {isLoadingCollections ? (
              <div className="grid grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Skeleton className="h-24 w-full" />
                    <div className="p-3">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : userCollections?.length ? (
              <div className="grid grid-cols-2 gap-4">
                {userCollections.map(collection => (
                  <div key={collection.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                    {collection.imageUrl ? (
                      <div 
                        className="h-24 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${collection.imageUrl}')` }}
                      ></div>
                    ) : (
                      <div className="h-24 bg-coffee-cream/50 flex items-center justify-center">
                        <CoffeeIcon className="h-8 w-8 text-coffee-brown/30" />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="font-medium text-coffee-brown">{collection.name}</h4>
                      <p className="text-xs text-coffee-brown/70">
                        Coffee collection
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-coffee-brown/70">
                {isCurrentUser 
                  ? "You haven't created any collections yet." 
                  : "This user hasn't created any collections yet."}
              </div>
            )}
          </div>
        </main>
        
        {/* Mobile navigation */}
        <MobileNav />
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-coffee-brown font-serif text-xl">Edit Profile</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditProfile)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-brown">Display Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Display Name" 
                        {...field} 
                        className="border-coffee-cream/70 focus-visible:ring-coffee-red" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-brown">Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your coffee journey..." 
                        {...field} 
                        className="border-coffee-cream/70 focus-visible:ring-coffee-red"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-coffee-cream text-coffee-brown"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  className="bg-coffee-red text-white hover:bg-coffee-red/90"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></div>
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}