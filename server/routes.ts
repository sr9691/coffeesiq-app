import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { insertCoffeeSchema, insertReviewSchema, insertFlavorNoteSchema, insertCollectionSchema, 
         insertShopProductSchema, insertMascotGuideSchema, insertQuizQuestionSchema, insertQuizOptionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import * as expressSession from "express-session";

// Extend the session data type to support barcode cache
declare module "express-session" {
  interface SessionData {
    [key: string]: any;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Initialize database with default data
  // This ensures all our hardcoded data is migrated to the database
  if ('initializeDefaultData' in storage) {
    await storage.initializeDefaultData();
  }

  // API routes
  // Coffees
  app.get("/api/coffees", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const coffees = await storage.getCoffees(limit, offset);
      res.json(coffees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coffees" });
    }
  });

  app.get("/api/coffees/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const coffees = await storage.searchCoffees(query);
      res.json(coffees);
    } catch (error) {
      res.status(500).json({ message: "Failed to search coffees" });
    }
  });

  app.get("/api/coffees/:id", async (req, res) => {
    try {
      const coffeeId = parseInt(req.params.id);
      const coffee = await storage.getCoffee(coffeeId);
      
      if (!coffee) {
        return res.status(404).json({ message: "Coffee not found" });
      }
      
      res.json(coffee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coffee" });
    }
  });

  app.post("/api/coffees", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a coffee" });
    }
    
    try {
      const coffeeData = insertCoffeeSchema.parse({
        ...req.body,
        submittedBy: req.user.id
      });
      
      const coffee = await storage.createCoffee(coffeeData);
      res.status(201).json(coffee);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create coffee" });
    }
  });

  // Flavor notes
  app.get("/api/flavor-notes", async (req, res) => {
    try {
      const flavorNotes = await storage.getFlavorNotes();
      res.json(flavorNotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flavor notes" });
    }
  });

  app.get("/api/coffees/:id/flavor-notes", async (req, res) => {
    try {
      const coffeeId = parseInt(req.params.id);
      const flavorNotes = await storage.getFlavorNotesByCoffee(coffeeId);
      res.json(flavorNotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flavor notes for coffee" });
    }
  });

  app.post("/api/flavor-notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a flavor note" });
    }
    
    try {
      const flavorNoteData = insertFlavorNoteSchema.parse(req.body);
      const flavorNote = await storage.createFlavorNote(flavorNoteData);
      res.status(201).json(flavorNote);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create flavor note" });
    }
  });



  // Reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const reviews = await storage.getReviews(limit, offset);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/coffees/:id/reviews", async (req, res) => {
    try {
      const coffeeId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByCoffee(coffeeId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews for coffee" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a review" });
    }
    
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // User profiles
  app.get("/api/users/:id/coffees", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const coffees = await storage.getCoffeesByUser(userId);
      res.json(coffees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user coffees" });
    }
  });

  app.get("/api/users/:id/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  // Favorites
  app.get("/api/users/:id/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const favorites = await storage.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user favorites" });
    }
  });

  app.post("/api/coffees/:id/favorite", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to favorite a coffee" });
    }
    
    try {
      const coffeeId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const isFavorite = await storage.isFavorite(userId, coffeeId);
      
      if (isFavorite) {
        await storage.removeFavorite(userId, coffeeId);
        return res.json({ favorited: false });
      } else {
        await storage.addFavorite({ userId, coffeeId });
        return res.json({ favorited: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  app.get("/api/coffees/:id/is-favorite", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.json({ isFavorite: false });
    }
    
    try {
      const coffeeId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const isFavorite = await storage.isFavorite(userId, coffeeId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Collections
  app.get("/api/users/:id/collections", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const collections = await storage.getCollectionsByUser(userId);
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user collections" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create a collection" });
    }
    
    try {
      const collectionData = insertCollectionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const collection = await storage.createCollection(collectionData);
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create collection" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.id);
      const collection = await storage.getCollection(collectionId);
      
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      
      const coffees = await storage.getCollectionItems(collectionId);
      
      res.json({
        ...collection,
        coffees
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  app.post("/api/collections/:id/coffees/:coffeeId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a coffee to a collection" });
    }
    
    try {
      const collectionId = parseInt(req.params.id);
      const coffeeId = parseInt(req.params.coffeeId);
      
      const collection = await storage.getCollection(collectionId);
      
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      
      if (collection.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only add coffees to your own collections" });
      }
      
      await storage.addCoffeeToCollection({
        collectionId,
        coffeeId
      });
      
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to add coffee to collection" });
    }
  });

  app.delete("/api/collections/:id/coffees/:coffeeId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to remove a coffee from a collection" });
    }
    
    try {
      const collectionId = parseInt(req.params.id);
      const coffeeId = parseInt(req.params.coffeeId);
      
      const collection = await storage.getCollection(collectionId);
      
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      
      if (collection.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only remove coffees from your own collections" });
      }
      
      const success = await storage.removeCoffeeFromCollection(collectionId, coffeeId);
      
      if (!success) {
        return res.status(404).json({ message: "Coffee not found in collection" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove coffee from collection" });
    }
  });

  // Social - following
  app.get("/api/users/:id/following", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const following = await storage.getFollowingByUser(userId);
      
      // Remove passwords from the response
      const followingWithoutPasswords = following.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(followingWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch following" });
    }
  });

  app.get("/api/users/:id/followers", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const followers = await storage.getFollowersByUser(userId);
      
      // Remove passwords from the response
      const followersWithoutPasswords = followers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(followersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch followers" });
    }
  });

  // Update user profile (avatar, bio, etc.)
  app.patch("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to update your profile" });
    }
    
    try {
      const userId = parseInt(req.params.id);
      
      // Only allow users to update their own profile
      if (userId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      
      // Update the user with the provided data
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data before returning
      const { password, resetToken, resetTokenExpires, ...safeUser } = updatedUser;
      
      return res.json(safeUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post("/api/users/:id/follow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to follow a user" });
    }
    
    try {
      const followedId = parseInt(req.params.id);
      const followerId = req.user.id;
      
      if (followedId === followerId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
      
      const isFollowing = await storage.isFollowing(followerId, followedId);
      
      if (isFollowing) {
        await storage.unfollowUser(followerId, followedId);
        return res.json({ following: false });
      } else {
        await storage.followUser({ followerId, followedId });
        return res.json({ following: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle follow" });
    }
  });

  app.get("/api/users/:id/is-following", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.json({ isFollowing: false });
    }
    
    try {
      const followedId = parseInt(req.params.id);
      const followerId = req.user.id;
      
      const isFollowing = await storage.isFollowing(followerId, followedId);
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  // ===== New API endpoints for database-driven content =====
  
  // Barcode Lookup
  app.get("/api/barcode/:upc", async (req, res) => {
    try {
      const upc = req.params.upc;
      if (!upc) {
        return res.status(400).json({ error: "UPC code is required" });
      }
      
      // Create a simple cache key
      const cacheKey = `barcode_${upc}`;
      
      // Use a safer approach without relying on session for caching
      // Instead, just make the API call each time
      // This avoids TypeScript issues with session types
      
      // Make request to UPC database
      const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`);
      const data = await response.json();
      
      // No caching in session to avoid type issues
      
      // Return the response
      res.json(data);
    } catch (error) {
      console.error("Error looking up barcode:", error);
      res.status(500).json({ error: "Failed to lookup barcode" });
    }
  });
  
  // Shop Products
  app.get("/api/shop-products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const products = await storage.getShopProducts(limit, offset);
      
      // Generate placeholder images for shop products
      const productsWithImages = products.map(product => ({
        ...product,
        image: generatePlaceholderImage(product.roastLevel)
      }));
      
      res.json(productsWithImages);
    } catch (error) {
      console.error("Error fetching shop products:", error);
      res.status(500).json({ message: "Failed to fetch shop products" });
    }
  });

  app.get("/api/shop-products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedShopProducts();
      
      // Generate placeholder images for featured products
      const productsWithImages = products.map(product => ({
        ...product,
        image: generatePlaceholderImage(product.roastLevel)
      }));
      
      res.json(productsWithImages);
    } catch (error) {
      console.error("Error fetching featured shop products:", error);
      res.status(500).json({ message: "Failed to fetch featured shop products" });
    }
  });

  app.get("/api/shop-products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getShopProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Generate placeholder image
      const productWithImage = {
        ...product,
        image: generatePlaceholderImage(product.roastLevel)
      };
      
      res.json(productWithImage);
    } catch (error) {
      console.error("Error fetching shop product:", error);
      res.status(500).json({ message: "Failed to fetch shop product" });
    }
  });

  // Only admins would be able to manage shop products in a real implementation
  app.post("/api/shop-products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a product" });
    }
    
    try {
      const productData = insertShopProductSchema.parse(req.body);
      const product = await storage.createShopProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error creating shop product:", error);
      res.status(500).json({ message: "Failed to create shop product" });
    }
  });
  
  // Mascot Guides
  app.get("/api/mascot-guides", async (req, res) => {
    try {
      const guides = await storage.getMascotGuides();
      res.json(guides);
    } catch (error) {
      console.error("Error fetching mascot guides:", error);
      res.status(500).json({ message: "Failed to fetch mascot guides" });
    }
  });

  app.get("/api/mascot-guides/:name", async (req, res) => {
    try {
      const guide = await storage.getMascotGuideByName(req.params.name);
      
      if (!guide) {
        return res.status(404).json({ message: "Mascot guide not found" });
      }
      
      res.json(guide);
    } catch (error) {
      console.error("Error fetching mascot guide:", error);
      res.status(500).json({ message: "Failed to fetch mascot guide" });
    }
  });

  // Only admins would be able to manage mascot guides in a real implementation
  app.post("/api/mascot-guides", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a mascot guide" });
    }
    
    try {
      const guideData = insertMascotGuideSchema.parse(req.body);
      const guide = await storage.createMascotGuide(guideData);
      res.status(201).json(guide);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error creating mascot guide:", error);
      res.status(500).json({ message: "Failed to create mascot guide" });
    }
  });
  
  // Quiz Questions and Options
  app.get("/api/quiz-questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions();
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.questionId);
          return {
            ...question,
            options
          };
        })
      );
      
      res.json(questionsWithOptions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  app.get("/api/quiz-questions/:questionId", async (req, res) => {
    try {
      const question = await storage.getQuizQuestionByQuestionId(req.params.questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Quiz question not found" });
      }
      
      // Get options for this question
      const options = await storage.getQuizOptions(question.questionId);
      
      res.json({
        ...question,
        options
      });
    } catch (error) {
      console.error("Error fetching quiz question:", error);
      res.status(500).json({ message: "Failed to fetch quiz question" });
    }
  });

  // Only admins would be able to manage quiz questions in a real implementation
  app.post("/api/quiz-questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add a quiz question" });
    }
    
    try {
      const questionData = insertQuizQuestionSchema.parse(req.body);
      const question = await storage.createQuizQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error creating quiz question:", error);
      res.status(500).json({ message: "Failed to create quiz question" });
    }
  });

  // Helper function to generate placeholder SVG for CoffeesIQ
  function generatePlaceholderImage(roastLevel: string) {
    let color = "#A67C52"; // Default medium roast color
    
    if (roastLevel === "Light") {
      color = "#C19A6B";
    } else if (roastLevel === "Medium-Light") {
      color = "#B5835A";
    } else if (roastLevel === "Medium-Dark") {
      color = "#8B5A2B";
    } else if (roastLevel === "Dark") {
      color = "#654321";
    }
    
    // Added CoffeesIQ text and styling to SVG
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f9f5f2'/%3E%3Cellipse cx='35' cy='40' rx='15' ry='20' fill='${color.replace('#', '%23')}' /%3E%3Cellipse cx='65' cy='60' rx='15' ry='20' fill='${color.replace('#', '%23')}' /%3E%3Ctext x='50' y='85' font-family='Arial' font-size='10' text-anchor='middle' fill='%23654321' font-weight='bold'%3ECoffeesIQ%3C/text%3E%3C/svg%3E`;
  }

  // Password reset functionality
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal that the user doesn't exist for security reasons
        return res.status(200).json({ message: "If your email is registered, you'll receive a password reset link" });
      }
      
      // In a real-world scenario, we would:
      // 1. Generate a secure token
      // 2. Store it in the database with an expiration time
      // 3. Send an email with a link containing the token
      
      // For now, we'll simulate this behavior by returning success
      // In the final implementation, this would be replaced with actual email sending logic
      
      // Note: In production, use a secure token generation library
      const resetToken = Buffer.from(Math.random().toString(36) + Date.now().toString(36)).toString('base64');
      
      // Update user with reset token
      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpires: new Date(Date.now() + 3600000) // 1 hour from now
      });
      
      // In production, this would send an email with a link like:
      // https://yourapp.com/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      return res.status(200).json({ 
        message: "If your email is registered, you'll receive a password reset link",
        // Only for development: Include the reset URL directly in the response
        // Remove this in production!
        resetUrl: `/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
      });
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ message: "An error occurred during password reset request" });
    }
  });
  
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, email, password } = req.body;
      
      if (!token || !email || !password) {
        return res.status(400).json({ message: "Token, email, and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.resetToken !== token) {
        return res.status(400).json({ message: "Invalid or expired password reset token" });
      }
      
      // Check if token is expired
      const tokenExpiry = user.resetTokenExpires ? new Date(user.resetTokenExpires) : null;
      if (!tokenExpiry || tokenExpiry < new Date()) {
        return res.status(400).json({ message: "Password reset token has expired" });
      }
      
      // Hash the new password
      const { hashPassword } = require('./auth');
      const hashedPassword = await hashPassword(password);
      
      // Update user password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      });
      
      return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error in reset password:", error);
      res.status(500).json({ message: "An error occurred while resetting password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
