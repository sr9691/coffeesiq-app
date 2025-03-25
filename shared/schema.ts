import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),  // Made optional for OAuth users
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  // OAuth related fields
  googleId: text("google_id").unique(),
  facebookId: text("facebook_id").unique(),
  appleId: text("apple_id").unique(),
  authProvider: text("auth_provider"), // 'local', 'google', 'facebook', 'apple'
  // Password reset fields
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  googleId: true,
  facebookId: true,
  appleId: true,
  authProvider: true,
  resetToken: true,
  resetTokenExpires: true,
});

// Coffee beans table
export const coffees = pgTable("coffees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roaster: text("roaster").notNull(),
  origin: text("origin").notNull(),
  region: text("region"),
  roastLevel: text("roast_level").notNull(),
  processMethod: text("process_method"),
  description: text("description"),
  imageUrl: text("image_url"),
  barcode: text("barcode"),
  submittedBy: integer("submitted_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCoffeeSchema = createInsertSchema(coffees).pick({
  name: true,
  roaster: true,
  origin: true,
  region: true,
  roastLevel: true,
  processMethod: true,
  description: true,
  imageUrl: true,
  barcode: true,
  submittedBy: true,
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  coffeeId: integer("coffee_id").notNull(),
  rating: integer("rating").notNull(),
  brewingMethod: text("brewing_method"),
  review: text("review"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  coffeeId: true,
  rating: true,
  brewingMethod: true,
  review: true,
  imageUrl: true,
});

// Flavor notes table
export const flavorNotes = pgTable("flavor_notes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertFlavorNoteSchema = createInsertSchema(flavorNotes).pick({
  name: true,
});

// Coffee flavor notes join table
export const coffeeFlavorNotes = pgTable("coffee_flavor_notes", {
  id: serial("id").primaryKey(),
  coffeeId: integer("coffee_id").notNull(),
  flavorNoteId: integer("flavor_note_id").notNull(),
});

export const insertCoffeeFlavorNoteSchema = createInsertSchema(coffeeFlavorNotes).pick({
  coffeeId: true,
  flavorNoteId: true,
});

// Review flavor notes join table
export const reviewFlavorNotes = pgTable("review_flavor_notes", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull(),
  flavorNoteId: integer("flavor_note_id").notNull(),
});

export const insertReviewFlavorNoteSchema = createInsertSchema(reviewFlavorNotes).pick({
  reviewId: true,
  flavorNoteId: true,
});



// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  coffeeId: integer("coffee_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  coffeeId: true,
});

// User follows table
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followedId: integer("followed_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followedId: true,
});

// Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCollectionSchema = createInsertSchema(collections).pick({
  userId: true,
  name: true,
  description: true,
  imageUrl: true,
});

// Collection items table
export const collectionItems = pgTable("collection_items", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").notNull(),
  coffeeId: integer("coffee_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCollectionItemSchema = createInsertSchema(collectionItems).pick({
  collectionId: true,
  coffeeId: true,
});

// Shop products table
export const shopProducts = pgTable("shop_products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  rating: doublePrecision("rating").notNull(),
  origin: text("origin").notNull(),
  roastLevel: text("roast_level").notNull(),
  weight: text("weight").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertShopProductSchema = createInsertSchema(shopProducts).pick({
  title: true,
  description: true,
  price: true,
  image: true,
  rating: true,
  origin: true,
  roastLevel: true,
  weight: true,
  inStock: true,
  featured: true,
});

// Mascot guide instances table
export const mascotGuides = pgTable("mascot_guides", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  message: text("message").notNull(),
  mood: text("mood").notNull(),
  position: text("position").notNull(),
  priority: integer("priority").notNull(),
  delay: integer("delay"),
  autoHide: boolean("auto_hide").default(false),
  hideAfter: integer("hide_after"),
  condition: text("condition").notNull(), // Store as a string that describes the condition
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMascotGuideSchema = createInsertSchema(mascotGuides).pick({
  name: true,
  message: true,
  mood: true,
  position: true,
  priority: true,
  delay: true,
  autoHide: true,
  hideAfter: true,
  condition: true,
});

// Quiz questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  questionId: text("question_id").notNull().unique(),
  question: text("question").notNull(),
  description: text("description"),
  answerType: text("answer_type").notNull(),
  sortOrder: integer("sort_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  questionId: true,
  question: true,
  description: true,
  answerType: true,
  sortOrder: true,
});

// Quiz options table
export const quizOptions = pgTable("quiz_options", {
  id: serial("id").primaryKey(),
  questionId: text("question_id").notNull(),
  optionId: text("option_id").notNull(),
  text: text("text").notNull(),
  value: text("value").notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizOptionSchema = createInsertSchema(quizOptions).pick({
  questionId: true,
  optionId: true,
  text: true,
  value: true,
  icon: true,
  sortOrder: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Coffee = typeof coffees.$inferSelect;
export type InsertCoffee = z.infer<typeof insertCoffeeSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type FlavorNote = typeof flavorNotes.$inferSelect;
export type InsertFlavorNote = z.infer<typeof insertFlavorNoteSchema>;

export type CoffeeFlavorNote = typeof coffeeFlavorNotes.$inferSelect;
export type InsertCoffeeFlavorNote = z.infer<typeof insertCoffeeFlavorNoteSchema>;

export type ReviewFlavorNote = typeof reviewFlavorNotes.$inferSelect;
export type InsertReviewFlavorNote = z.infer<typeof insertReviewFlavorNoteSchema>;

// BrewingMethod interfaces removed

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type CollectionItem = typeof collectionItems.$inferSelect;
export type InsertCollectionItem = z.infer<typeof insertCollectionItemSchema>;

export type ShopProduct = typeof shopProducts.$inferSelect;
export type InsertShopProduct = z.infer<typeof insertShopProductSchema>;

export type MascotGuide = typeof mascotGuides.$inferSelect;
export type InsertMascotGuide = z.infer<typeof insertMascotGuideSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type QuizOption = typeof quizOptions.$inferSelect;
export type InsertQuizOption = z.infer<typeof insertQuizOptionSchema>;
