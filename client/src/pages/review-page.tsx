import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Coffee, insertReviewSchema, FlavorNote } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { getContent } from "@/lib/config";

import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

// Extend the review schema for the form, removing brewing method
const reviewFormSchema = insertReviewSchema
  .omit({ userId: true, brewingMethod: true }) 
  .extend({
    flavorNotes: z.array(z.number()).optional(),
  });

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const coffeeId = parseInt(id);
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedFlavorNotes, setSelectedFlavorNotes] = useState<number[]>([]);
  const [rating, setRating] = useState<number>(4);
  
  // Fetch coffee details
  const { data: coffee, isLoading: isLoadingCoffee } = useQuery<Coffee>({
    queryKey: [`/api/coffees/${coffeeId}`],
    enabled: !isNaN(coffeeId),
  });
  
  // Fetch flavor notes
  const { data: flavorNotes } = useQuery<FlavorNote[]>({
    queryKey: ["/api/flavor-notes"],
  });
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      coffeeId,
      rating: 4,
      review: "",
      imageUrl: "",
      flavorNotes: [],
    },
  });
  
  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const res = await apiRequest("POST", "/api/reviews", {
        ...data,
        userId: user?.id,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/coffees/${coffeeId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      navigate(`/coffee/${coffeeId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const toggleFlavorNote = (noteId: number) => {
    if (selectedFlavorNotes.includes(noteId)) {
      setSelectedFlavorNotes(selectedFlavorNotes.filter(id => id !== noteId));
    } else {
      setSelectedFlavorNotes([...selectedFlavorNotes, noteId]);
    }
  };
  
  const onSubmit = (data: ReviewFormValues) => {
    // Include the current rating and selected flavor notes
    data.rating = rating;
    data.flavorNotes = selectedFlavorNotes;
    submitReviewMutation.mutate(data);
  };
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    form.setValue("rating", newRating);
  };

  // Handle photo upload via file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Set the image URL field with the base64 data
          form.setValue("imageUrl", event.target.result as string);
          toast({
            title: "Image uploaded",
            description: "Your image has been added successfully.",
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Header */}
      <Navbar 
        showBack 
        title="Write Review" 
        onBack={() => navigate(`/coffee/${coffeeId}`)}
        rightContent={
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/coffee/${coffeeId}`)}
            className="text-coffee-light font-medium text-sm"
          >
            Cancel
          </Button>
        }
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-6 flex-1">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-4">
            {isLoadingCoffee ? (
              <>
                <Skeleton className="w-16 h-16 rounded-md mr-3" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            ) : (
              <>
                {coffee?.imageUrl ? (
                  <img 
                    src={coffee.imageUrl} 
                    alt={coffee.name && coffee.roaster 
                      ? getContent('coffee.imageAlt.coffeeImage', '{name} from {roaster}')
                          .replace('{name}', coffee.name)
                          .replace('{roaster}', coffee.roaster)
                      : getContent('coffee.imageAlt.default', 'CoffeesIQ')} 
                    className="w-16 h-16 object-cover rounded-md mr-3"
                  />
                ) : (
                  <div className="w-16 h-16 bg-coffee-cream flex flex-col items-center justify-center rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-coffee-brown/40">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                      <line x1="6" x2="6" y1="2" y2="4"></line>
                      <line x1="10" x2="10" y1="2" y2="4"></line>
                      <line x1="14" x2="14" y1="2" y2="4"></line>
                    </svg>
                    <span className="mt-1 text-xs font-bold text-coffee-brown">{getContent('app.name', 'CoffeesIQ')}</span>
                  </div>
                )}
                <div>
                  <h2 className="font-medium text-coffee-brown">{coffee?.name}</h2>
                  <p className="text-sm text-coffee-brown/70">
                    {coffee?.roastLevel} Roast • {coffee?.origin}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <FormLabel className="block text-sm font-medium text-coffee-brown mb-2">Your Rating</FormLabel>
                <div className="flex items-center text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`text-2xl mr-2 ${rating >= star ? 'text-coffee-brown' : 'text-coffee-brown/30'}`}
                      onClick={() => handleRatingChange(star)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                      </svg>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <FormLabel className="block text-sm font-medium text-coffee-brown mb-2">Flavor Notes</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {flavorNotes?.map(note => (
                    <Badge 
                      key={note.id}
                      variant={selectedFlavorNotes.includes(note.id) ? "default" : "outline"}
                      className={`
                        cursor-pointer hover:bg-coffee-cream 
                        ${selectedFlavorNotes.includes(note.id) 
                          ? 'bg-coffee-green text-white hover:bg-coffee-green/80' 
                          : 'bg-coffee-cream/30 text-coffee-brown'}
                      `}
                      onClick={() => toggleFlavorNote(note.id)}
                    >
                      {note.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-brown">Your Review</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What did you think about this coffee?" 
                        {...field} 
                        value={field.value || ''}
                        className="border-coffee-cream focus:ring-coffee-brown"
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel className="block text-sm font-medium text-coffee-brown mb-2">Add Photos</FormLabel>
                <div className="border-2 border-dashed border-coffee-cream rounded-md p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Camera className="text-coffee-brown/50 h-8 w-8 mb-2" />
                    <span className="text-coffee-brown/70 mb-2">Add photos of your brew</span>
                    
                    <div className="grid grid-cols-1 gap-3 w-full">
                      {/* File Upload Option */}
                      <div className="w-full">
                        <Input
                          type="file"
                          accept="image/*"
                          id="photo-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full border-coffee-cream hover:bg-coffee-cream/20 text-coffee-brown"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          <Camera className="mr-2 h-4 w-4" /> Upload Photo
                        </Button>
                      </div>
                      
                      {/* OR Divider */}
                      <div className="relative w-full flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-coffee-cream/50"></div>
                        </div>
                        <div className="relative px-3 bg-white text-sm text-coffee-brown/60">OR</div>
                      </div>
                      
                      {/* URL Option */}
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter image URL"
                                {...field}
                                value={field.value || ''}
                                className="border-coffee-cream focus:ring-coffee-brown"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Preview image if available */}
                    {form.watch("imageUrl") && (
                      <div className="mt-4">
                        <img 
                          src={form.watch("imageUrl") as string} 
                          alt={getContent('coffee.imageAlt.default', 'CoffeesIQ')} 
                          className="max-h-32 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                  disabled={submitReviewMutation.isPending}
                >
                  {submitReviewMutation.isPending ? "Posting..." : "Post Review"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
