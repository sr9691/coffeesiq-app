import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Coffee, insertCoffeeSchema, FlavorNote } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// Helper function to ensure form fields are never null
const stringOrEmpty = (val: string | null | undefined): string => {
  return val === null || val === undefined ? "" : val;
};

import Navbar from "@/components/layout/navbar";
import MobileNav from "@/components/layout/mobile-nav";
import BarcodeScanner from "@/components/barcode-scanner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Barcode, Camera, Search, Loader2 } from "lucide-react";

// Extend the coffee schema for the form
const addCoffeeSchema = insertCoffeeSchema.omit({ submittedBy: true }).extend({
  flavorNotes: z.array(z.number()).optional(),
  name: z.string().min(1, "Coffee name is required"),
  roaster: z.string().min(1, "Roaster name is required"),
  origin: z.string().min(1, "Origin country is required"),
  region: z.string().optional(),
  roastLevel: z.string().min(1, "Roast level is required"),
  processMethod: z.string().min(1, "Process method is required"),
  description: z.string().optional().transform(val => val || ""),
  imageUrl: z.string().optional().transform(val => val || ""),
  barcode: z.string().optional().transform(val => val || ""),
});

type AddCoffeeFormValues = z.infer<typeof addCoffeeSchema>;

export default function AddCoffee() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"manual" | "barcode">("manual");
  const [selectedFlavorNotes, setSelectedFlavorNotes] = useState<number[]>([]);
  
  // Fetch flavor notes
  const { data: flavorNotes } = useQuery<FlavorNote[]>({
    queryKey: ["/api/flavor-notes"],
  });
  
  const form = useForm<AddCoffeeFormValues>({
    resolver: zodResolver(addCoffeeSchema),
    defaultValues: {
      name: "",
      roaster: "",
      origin: "",
      region: "",
      roastLevel: "",
      processMethod: "",
      description: "",
      imageUrl: "",
      barcode: "",
      flavorNotes: [],
    },
    // Ensure null values are converted to empty strings
    shouldUseNativeValidation: false,
  });
  
  const addCoffeeMutation = useMutation({
    mutationFn: async (data: AddCoffeeFormValues) => {
      const res = await apiRequest("POST", "/api/coffees", {
        ...data,
        submittedBy: user?.id,
      });
      return res.json();
    },
    onSuccess: (coffee: Coffee) => {
      toast({
        title: "Coffee added successfully",
        description: "Your coffee has been added to our database.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/coffees"] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add coffee",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: AddCoffeeFormValues) => {
    // Include selected flavor notes
    data.flavorNotes = selectedFlavorNotes;
    addCoffeeMutation.mutate(data);
  };
  
  const toggleFlavorNote = (noteId: number) => {
    if (selectedFlavorNotes.includes(noteId)) {
      setSelectedFlavorNotes(selectedFlavorNotes.filter(id => id !== noteId));
    } else {
      setSelectedFlavorNotes([...selectedFlavorNotes, noteId]);
    }
  };
  
  return (
    <div className="min-h-screen bg-coffee-light flex flex-col">
      {/* Header */}
      <Navbar 
        showBack 
        title="Add New Coffee" 
        onBack={() => navigate("/")}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 flex-1">
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="mb-4 flex justify-between">
            <Button
              type="button"
              variant={activeTab === "manual" ? "default" : "ghost"}
              className={`flex items-center justify-center w-1/2 py-2 ${
                activeTab === "manual" 
                  ? "text-coffee-light bg-coffee-brown" 
                  : "text-coffee-brown/60"
              }`}
              onClick={() => setActiveTab("manual")}
            >
              <Edit className="mr-2 h-4 w-4" /> Manual Entry
            </Button>
            <Button
              type="button"
              variant={activeTab === "barcode" ? "default" : "ghost"}
              className={`flex items-center justify-center w-1/2 py-2 ${
                activeTab === "barcode" 
                  ? "text-coffee-light bg-coffee-brown" 
                  : "text-coffee-brown/60"
              }`}
              onClick={() => setActiveTab("barcode")}
            >
              <Barcode className="mr-2 h-4 w-4" /> Scan Barcode
            </Button>
          </div>
          
          {activeTab === "manual" ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown">Coffee Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g., Ethiopian Yirgacheffe" 
                          {...field} 
                          className="border-coffee-cream focus:ring-coffee-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="roaster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown">Roaster</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Coffee roaster name" 
                          {...field} 
                          className="border-coffee-cream focus:ring-coffee-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-coffee-brown">Origin</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Country" 
                            {...field} 
                            className="border-coffee-cream focus:ring-coffee-brown"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-coffee-brown">Region</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Region (optional)" 
                            {...field} 
                            className="border-coffee-cream focus:ring-coffee-brown"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="roastLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown">Roast Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-coffee-cream focus:ring-coffee-brown">
                            <SelectValue placeholder="Select roast level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Light">Light</SelectItem>
                          <SelectItem value="Medium-Light">Medium-Light</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Medium-Dark">Medium-Dark</SelectItem>
                          <SelectItem value="Dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="processMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown">Process</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-coffee-cream focus:ring-coffee-brown">
                            <SelectValue placeholder="Select process method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Washed">Washed</SelectItem>
                          <SelectItem value="Natural">Natural</SelectItem>
                          <SelectItem value="Honey">Honey</SelectItem>
                          <SelectItem value="Anaerobic">Anaerobic</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel className="block text-sm font-medium text-coffee-brown mb-1">Tasting Notes</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {flavorNotes?.map(note => (
                      <Badge 
                        key={note.id}
                        variant={selectedFlavorNotes.includes(note.id) ? "default" : "outline"}
                        className={`
                          cursor-pointer hover:bg-coffee-cream 
                          ${selectedFlavorNotes.includes(note.id) 
                            ? 'bg-coffee-red text-white hover:bg-coffee-red/80' 
                            : 'bg-coffee-cream/30 text-coffee-brown'}
                        `}
                        onClick={() => toggleFlavorNote(note.id)}
                      >
                        {note.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <FormLabel className="block text-sm font-medium text-coffee-brown mb-1">Add Photos</FormLabel>
                  <div className="border-2 border-dashed border-coffee-cream rounded-md p-6 text-center">
                    <div className="flex flex-col items-center">
                      <Camera className="h-8 w-8 text-coffee-brown/50 mb-2" />
                      <span className="text-coffee-brown/70 mb-2">Add photos of the coffee</span>
                      
                      <div className="grid grid-cols-1 gap-3 w-full">
                        {/* File Upload Option */}
                        <div className="w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            id="photo-upload"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    // Set the image URL field with the base64 data
                                    form.setValue("imageUrl", event.target.result as string);
                                    
                                    // Show a success message
                                    toast({
                                      title: "Image uploaded",
                                      description: "Your image has been added successfully.",
                                    });
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
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
                        
                        {/* Or Text */}
                        <div className="relative w-full flex items-center justify-center">
                          <div className="absolute border-t border-coffee-cream w-full"></div>
                          <span className="px-3 bg-white text-coffee-brown/60 text-sm">OR</span>
                        </div>
                        
                        {/* Image URL Option */}
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  placeholder="Enter image URL"
                                  {...field}
                                  className="border-coffee-cream focus:ring-coffee-brown"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Preview Image if available */}
                        {form.watch("imageUrl") && (
                          <div className="mt-2">
                            <p className="text-xs text-coffee-brown/60 mb-1">Preview:</p>
                            <div className="w-full max-h-48 overflow-hidden rounded border border-coffee-cream">
                              <img 
                                src={form.watch("imageUrl")} 
                                alt="Coffee preview" 
                                className="w-full h-auto object-contain"
                                onError={() => {
                                  toast({
                                    title: "Image error",
                                    description: "Could not load image from provided URL.",
                                    variant: "destructive",
                                  });
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional details about this coffee" 
                          {...field} 
                          className="border-coffee-cream focus:ring-coffee-brown"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown">Barcode</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter barcode (optional)" 
                          {...field} 
                          className="border-coffee-cream focus:ring-coffee-brown"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        The barcode from the coffee packaging, if available.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                  disabled={addCoffeeMutation.isPending}
                >
                  {addCoffeeMutation.isPending ? "Submitting..." : "Submit Coffee"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              {/* Barcode Scanner Section */}
              <div className="border-2 border-coffee-cream rounded-lg p-4">
                <h3 className="text-lg font-medium text-coffee-brown mb-3 text-center">Scan Coffee Barcode</h3>
                <BarcodeScanner 
                  onBarcodeDetected={async (barcode) => {
                    // Set the barcode in the form
                    form.setValue("barcode", barcode);
                    
                    // Show initial toast indicating scan success
                    toast({
                      title: "Barcode Detected!",
                      description: `Searching for coffee information with barcode ${barcode}...`,
                    });
                    
                    try {
                      // Look up barcode in UPC database
                      const response = await fetch(`/api/barcode/${barcode}`);
                      const data = await response.json();
                      
                      // If we have results, populate the form fields
                      if (data && data.items && data.items.length > 0) {
                        const item = data.items[0];
                        
                        // Populate form with available data
                        if (item.title) form.setValue("name", item.title);
                        if (item.brand) form.setValue("roaster", item.brand);
                        if (item.description) form.setValue("description", item.description);
                        
                        // If there's an image URL, set it
                        if (item.images && item.images.length > 0) {
                          form.setValue("imageUrl", item.images[0]);
                        }
                        
                        toast({
                          title: "Coffee Information Found!",
                          description: "We've filled in some details based on the barcode. Please review and complete any missing information.",
                        });
                      } else {
                        toast({
                          title: "Barcode Detected",
                          description: "No additional information found for this barcode. Please fill in the details manually.",
                        });
                      }
                    } catch (error) {
                      console.error("Error looking up barcode:", error);
                      toast({
                        title: "Barcode Detected",
                        description: "Couldn't look up additional information. Please fill in the details manually.",
                        variant: "destructive",
                      });
                    }
                    
                    // Switch to manual entry tab with barcode and any found information filled
                    setActiveTab("manual");
                  }}
                  onError={(error) => {
                    toast({
                      title: "Scanner Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  }}
                />
              </div>
              
              {/* Manual Barcode Entry */}
              <div>
                <h3 className="block text-sm font-medium text-coffee-brown mb-1">Or Enter Barcode Manually</h3>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter barcode number" 
                    className="border-coffee-cream focus:ring-coffee-brown"
                    value={stringOrEmpty(form.watch("barcode"))}
                    onChange={(e) => form.setValue("barcode", e.target.value)}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-coffee-brown text-coffee-brown"
                    onClick={async () => {
                      const barcode = form.watch("barcode");
                      if (barcode) {
                        // Show searching toast
                        toast({
                          title: "Searching Barcode",
                          description: `Looking up information for barcode ${barcode}...`,
                        });
                        
                        try {
                          // Look up barcode in UPC database
                          const response = await fetch(`/api/barcode/${barcode}`);
                          const data = await response.json();
                          
                          // If we have results, populate the form fields
                          if (data && data.items && data.items.length > 0) {
                            const item = data.items[0];
                            
                            // Populate form with available data
                            if (item.title) form.setValue("name", item.title);
                            if (item.brand) form.setValue("roaster", item.brand);
                            if (item.description) form.setValue("description", item.description);
                            
                            // If there's an image URL, set it
                            if (item.images && item.images.length > 0) {
                              form.setValue("imageUrl", item.images[0]);
                            }
                            
                            toast({
                              title: "Coffee Information Found!",
                              description: "We've filled in some details based on the barcode. Please review and complete any missing information.",
                            });
                          } else {
                            toast({
                              title: "Barcode Processed",
                              description: "No additional information found. Please fill in the details manually.",
                            });
                          }
                        } catch (error) {
                          console.error("Error looking up barcode:", error);
                          toast({
                            title: "Barcode Processed",
                            description: "Couldn't look up additional information. Please fill in the details manually.",
                          });
                        }
                        
                        // Switch to manual entry tab with barcode filled
                        setActiveTab("manual");
                      } else {
                        toast({
                          title: "No Barcode Entered",
                          description: "Please enter a barcode number or scan a barcode.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" /> Search
                  </Button>
                </div>
              </div>
              
              <div className="bg-coffee-cream/20 rounded-lg p-4 text-coffee-brown/70">
                <h4 className="font-medium mb-1 text-center">How to use the barcode scanner</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Position your coffee package barcode in front of your camera</li>
                  <li>Hold steady until the barcode is detected</li>
                  <li>After scanning, you'll be redirected to the manual form with some fields pre-filled</li>
                  <li>Manually enter any additional information about the coffee</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}