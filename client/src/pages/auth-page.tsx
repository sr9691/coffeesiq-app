import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

// Extend loginSchema to include rememberMe
const loginFormSchema = loginSchema.extend({
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };
  
  // Social login handlers
  const handleGoogleLogin = () => {
    window.location.href = "/auth/google";
  };
  
  const handleFacebookLogin = () => {
    window.location.href = "/auth/facebook";
  };
  
  const handleAppleLogin = () => {
    window.location.href = "/auth/apple";
  };
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Auth Header */}
      <div className="bg-coffee-brown text-coffee-light p-4 text-center">
        <h1 className="font-serif text-3xl font-bold">CoffeesIQ</h1>
      </div>
      
      {/* Auth Content */}
      <div className="flex-1 flex md:flex-row flex-col items-center justify-center px-4 py-10 bg-cover bg-center"
           style={{ backgroundImage: "url('/images/coffee-bg.svg')" }}>
        
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-coffee-cream/30">
              <TabsTrigger value="login" className="text-coffee-brown">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="text-coffee-brown">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="bg-coffee-light">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl font-bold text-coffee-brown">Welcome Back</CardTitle>
                  <CardDescription className="text-coffee-brown/80">Sign in to discover and rate amazing coffee</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} className="border-coffee-cream focus:ring-coffee-brown" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="border-coffee-cream focus:ring-coffee-brown" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                  className="border-coffee-cream data-[state=checked]:bg-coffee-brown data-[state=checked]:border-coffee-brown" 
                                />
                              </FormControl>
                              <FormLabel className="text-sm text-coffee-brown font-normal">Remember me</FormLabel>
                            </FormItem>
                          )}
                        />
                        <Link href="/reset-password" className="text-sm text-coffee-red hover:text-coffee-red/80 transition">
                          Forgot password?
                        </Link>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-coffee-cream"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-coffee-light text-coffee-brown/70">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full border-coffee-cream hover:bg-gray-50"
                        onClick={handleGoogleLogin}
                      >
                        <FaGoogle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full border-coffee-cream hover:bg-gray-50"
                        onClick={handleFacebookLogin}
                      >
                        <FaFacebook className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full border-coffee-cream hover:bg-gray-50"
                        onClick={handleAppleLogin}
                      >
                        <FaApple className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-center w-full text-sm text-coffee-brown/80">
                    Don't have an account? 
                    <TabsTrigger value="register" className="font-medium text-coffee-red hover:text-coffee-red/80 transition ml-1 p-0 bg-transparent">
                      Sign up
                    </TabsTrigger>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="bg-coffee-light">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl font-bold text-coffee-brown">Create Account</CardTitle>
                  <CardDescription className="text-coffee-brown/80">Join the community of coffee enthusiasts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} className="border-coffee-cream focus:ring-coffee-brown" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Username</FormLabel>
                            <FormControl>
                              <Input placeholder="coffeelover" {...field} className="border-coffee-cream focus:ring-coffee-brown" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Display Name (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                className="border-coffee-cream focus:ring-coffee-brown"
                                {...field}
                                value={field.value || ''} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="border-coffee-cream focus:ring-coffee-brown" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-coffee-brown">Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="border-coffee-cream focus:ring-coffee-brown" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-coffee-brown text-coffee-light hover:bg-coffee-brown/90"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-coffee-cream"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-coffee-light text-coffee-brown/70">Or sign up with</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full border-coffee-cream hover:bg-gray-50"
                        onClick={handleGoogleLogin}
                      >
                        <FaGoogle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full border-coffee-cream hover:bg-gray-50"
                        onClick={handleFacebookLogin}
                      >
                        <FaFacebook className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full border-coffee-cream hover:bg-gray-50"
                        onClick={handleAppleLogin}
                      >
                        <FaApple className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-center w-full text-sm text-coffee-brown/80">
                    Already have an account? 
                    <TabsTrigger value="login" className="font-medium text-coffee-red hover:text-coffee-red/80 transition ml-1 p-0 bg-transparent">
                      Sign in
                    </TabsTrigger>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full max-w-md px-8 py-10 hidden md:block">
          <div className="text-coffee-light">
            <h2 className="font-serif text-4xl font-bold mb-4">Discover Your Perfect Cup</h2>
            <p className="mb-6 text-lg">Join thousands of coffee enthusiasts rating, reviewing, and sharing their favorite beans from around the world.</p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="bg-coffee-green rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-coffee-light">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Rate and review coffee beans from around the world</span>
              </li>
              <li className="flex items-center">
                <div className="bg-coffee-green rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-coffee-light">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Save your favorites and create personalized collections</span>
              </li>
              <li className="flex items-center">
                <div className="bg-coffee-green rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-coffee-light">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Connect with a community of passionate coffee experts</span>
              </li>
              <li className="flex items-center">
                <div className="bg-coffee-green rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-coffee-light">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Discover new coffees with personalized recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}