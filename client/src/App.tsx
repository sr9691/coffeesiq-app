import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { appConfig } from "../../config";

import { ConfigProvider } from "./context/ConfigContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { MascotProvider } from "@/components/mascot/mascot-context";
import MascotGuide from "@/components/mascot/mascot-guide";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CoffeeDetails from "@/pages/coffee-details";
import AddCoffee from "@/pages/add-coffee";
import ProfilePage from "@/pages/profile-page";
import ReviewPage from "@/pages/review-page";
import DiscoverPage from "@/pages/discover-page";
import QuizPage from "@/pages/quiz-page";
import ShopPage from "@/pages/shop-page";
import ResetPassword from "@/pages/reset-password";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/reset-password" component={ResetPassword} />
      <ProtectedRoute path="/coffee/:id" component={CoffeeDetails} />
      <ProtectedRoute path="/add-coffee" component={AddCoffee} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/profile/:id" component={ProfilePage} />
      <ProtectedRoute path="/review/:id" component={ReviewPage} />
      <ProtectedRoute path="/discover" component={DiscoverPage} />
      <ProtectedRoute path="/quiz" component={QuizPage} />
      <ProtectedRoute path="/shop" component={ShopPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MascotProvider>
            <Router />
            <MascotGuide />
            <Toaster />
          </MascotProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;