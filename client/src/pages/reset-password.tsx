import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema for email request
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Schema for password reset
const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RequestResetValues = z.infer<typeof requestResetSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  
  // Get token from URL if present
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');
  
  const requestForm = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const onRequestSubmit = async (data: RequestResetValues) => {
    try {
      setIsResetting(true);
      const response = await apiRequest("POST", "/api/forgot-password", data);
      
      if (response.ok) {
        setIsEmailSent(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for a password reset link",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to send reset email",
          description: errorData.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  const onResetSubmit = async (data: ResetPasswordValues) => {
    if (!token || !email) {
      toast({
        title: "Invalid reset link",
        description: "Your password reset link appears to be invalid",
        variant: "destructive", 
      });
      return;
    }
    
    try {
      setIsResetting(true);
      const response = await apiRequest("POST", "/api/reset-password", {
        ...data,
        token,
        email,
      });
      
      if (response.ok) {
        setIsResetSuccess(true);
        toast({
          title: "Password reset successful",
          description: "Your password has been updated. You can now log in with your new password.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to reset password",
          description: errorData.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-coffee-brown text-coffee-light p-4 text-center">
        <h1 className="font-serif text-3xl font-bold">CoffeesIQ</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-cover bg-center"
           style={{ backgroundImage: "url('/images/coffee-bg.svg')" }}>
        <div className="w-full max-w-md">
          {!token ? (
            // Request password reset form (no token in URL)
            <Card className="bg-coffee-light">
              <CardHeader>
                <CardTitle className="font-serif text-2xl font-bold text-coffee-brown">Reset Password</CardTitle>
                <CardDescription className="text-coffee-brown/80">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isEmailSent ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      A password reset link has been sent to your email address. 
                      Please check your inbox and follow the instructions.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Form {...requestForm}>
                    <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
                      <FormField
                        control={requestForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your@email.com" 
                                {...field} 
                                className="border-coffee-cream focus:ring-coffee-brown" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                        disabled={isResetting}
                      >
                        {isResetting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
              
              <CardFooter className="pt-0">
                <p className="text-center w-full text-sm text-coffee-brown/80">
                  Remember your password?{" "}
                  <Link href="/auth" className="font-medium text-coffee-red hover:text-coffee-red/80 transition">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>
          ) : isResetSuccess ? (
            // Success message after password reset
            <Card className="bg-coffee-light">
              <CardHeader>
                <CardTitle className="font-serif text-2xl font-bold text-coffee-brown">Password Reset Successful</CardTitle>
                <CardDescription className="text-coffee-brown/80">
                  Your password has been successfully updated
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Alert className="bg-green-50 border-green-200 mb-4">
                  <AlertDescription className="text-green-800">
                    Your password has been reset successfully. You can now log in with your new password.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                  onClick={() => setLocation("/auth")}
                >
                  Return to Login
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Reset password form (with token in URL)
            <Card className="bg-coffee-light">
              <CardHeader>
                <CardTitle className="font-serif text-2xl font-bold text-coffee-brown">Create New Password</CardTitle>
                <CardDescription className="text-coffee-brown/80">
                  Please enter your new password
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-coffee-brown">New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="border-coffee-cream focus:ring-coffee-brown" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-coffee-brown">Confirm New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="border-coffee-cream focus:ring-coffee-brown" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                      disabled={isResetting}
                    >
                      {isResetting ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}