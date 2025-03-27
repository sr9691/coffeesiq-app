import { 
  users, User, InsertUser,
  coffees, Coffee, InsertCoffee,
  reviews, Review, InsertReview,
  flavorNotes, FlavorNote, InsertFlavorNote,
  coffeeFlavorNotes, CoffeeFlavorNote, InsertCoffeeFlavorNote,
  reviewFlavorNotes, ReviewFlavorNote, InsertReviewFlavorNote,
  favorites, Favorite, InsertFavorite,
  follows, Follow, InsertFollow,
  collections, Collection, InsertCollection,
  collectionItems, CollectionItem, InsertCollectionItem,
  // New imports for additional data
  shopProducts, ShopProduct, InsertShopProduct,
  mascotGuides, MascotGuide, InsertMascotGuide,
  quizQuestions, QuizQuestion, InsertQuizQuestion,
  quizOptions, QuizOption, InsertQuizOption
} from "@shared/schema";

import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq, and, like, desc, sql, asc } from "drizzle-orm";
import { db, pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Initialize PostgreSQL session store
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  // Initialize flavor notes
  private async initFlavorNotes(): Promise<void> {
    // Get all existing flavor note names
    const existingNotes = await db.select({ name: flavorNotes.name }).from(flavorNotes);
    const existingNoteNames = new Set(existingNotes.map(note => note.name));
    
    const notes = [
      "Floral", "Fruity", "Citrus", "Chocolate", "Nutty", 
      "Caramel", "Honey", "Berry", "Earthy", "Spicy"
    ];

    for (const note of notes) {
      // Only insert if this note doesn't already exist
      if (!existingNoteNames.has(note)) {
        await db.insert(flavorNotes).values({ name: note });
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId));
    return result[0];
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.facebookId, facebookId));
    return result[0];
  }

  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.appleId, appleId));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Coffee methods
  async getCoffee(id: number): Promise<Coffee | undefined> {
    const result = await db.select().from(coffees).where(eq(coffees.id, id));
    return result[0];
  }

  async getCoffees(limit = 10, offset = 0): Promise<Coffee[]> {
    return await db.select()
      .from(coffees)
      .orderBy(desc(coffees.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getCoffeesByUser(userId: number): Promise<Coffee[]> {
    return await db.select()
      .from(coffees)
      .where(eq(coffees.submittedBy, userId))
      .orderBy(desc(coffees.createdAt));
  }

  async searchCoffees(query: string): Promise<Coffee[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await db.select()
      .from(coffees)
      .where(
        sql`lower(${coffees.name}) like ${lowercaseQuery} or
            lower(${coffees.roaster}) like ${lowercaseQuery} or
            lower(${coffees.origin}) like ${lowercaseQuery} or
            (${coffees.region} is not null and lower(${coffees.region}) like ${lowercaseQuery})`
      )
      .orderBy(desc(coffees.createdAt));
  }

  async createCoffee(insertCoffee: InsertCoffee): Promise<Coffee> {
    const result = await db.insert(coffees).values(insertCoffee).returning();
    return result[0];
  }

  async updateCoffee(id: number, coffeeData: Partial<Coffee>): Promise<Coffee | undefined> {
    const result = await db.update(coffees)
      .set(coffeeData)
      .where(eq(coffees.id, id))
      .returning();
    return result[0];
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }

  async getReviews(limit = 10, offset = 0): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getReviewsByCoffee(coffeeId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.coffeeId, coffeeId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(insertReview).returning();
    return result[0];
  }

  // Flavor notes methods
  async getFlavorNote(id: number): Promise<FlavorNote | undefined> {
    const result = await db.select().from(flavorNotes).where(eq(flavorNotes.id, id));
    return result[0];
  }

  async getFlavorNotes(): Promise<FlavorNote[]> {
    return await db.select()
      .from(flavorNotes)
      .orderBy(flavorNotes.name);
  }

  async getFlavorNotesByCoffee(coffeeId: number): Promise<FlavorNote[]> {
    return await db.select({ 
      id: flavorNotes.id, 
      name: flavorNotes.name 
    })
      .from(flavorNotes)
      .innerJoin(
        coffeeFlavorNotes,
        and(
          eq(flavorNotes.id, coffeeFlavorNotes.flavorNoteId),
          eq(coffeeFlavorNotes.coffeeId, coffeeId)
        )
      )
      .orderBy(flavorNotes.name);
  }

  async getFlavorNotesByReview(reviewId: number): Promise<FlavorNote[]> {
    return await db.select({ 
      id: flavorNotes.id, 
      name: flavorNotes.name 
    })
      .from(flavorNotes)
      .innerJoin(
        reviewFlavorNotes,
        and(
          eq(flavorNotes.id, reviewFlavorNotes.flavorNoteId),
          eq(reviewFlavorNotes.reviewId, reviewId)
        )
      )
      .orderBy(flavorNotes.name);
  }

  async createFlavorNote(insertFlavorNote: InsertFlavorNote): Promise<FlavorNote> {
    const result = await db.insert(flavorNotes).values(insertFlavorNote).returning();
    return result[0];
  }

  // Coffee flavor notes methods
  async addFlavorNoteToCoffee(insertCoffeeFlavorNote: InsertCoffeeFlavorNote): Promise<CoffeeFlavorNote> {
    const result = await db.insert(coffeeFlavorNotes).values(insertCoffeeFlavorNote).returning();
    return result[0];
  }

  // Review flavor notes methods
  async addFlavorNoteToReview(insertReviewFlavorNote: InsertReviewFlavorNote): Promise<ReviewFlavorNote> {
    const result = await db.insert(reviewFlavorNotes).values(insertReviewFlavorNote).returning();
    return result[0];
  }

  // Brewing methods removed

  // Favorites methods
  async getFavoritesByUser(userId: number): Promise<Coffee[]> {
    return await db.select({
      id: coffees.id,
      name: coffees.name,
      roaster: coffees.roaster,
      origin: coffees.origin,
      roastLevel: coffees.roastLevel,
      submittedBy: coffees.submittedBy,
      createdAt: coffees.createdAt,
      region: coffees.region,
      processMethod: coffees.processMethod,
      description: coffees.description,
      imageUrl: coffees.imageUrl,
      barcode: coffees.barcode
    })
      .from(coffees)
      .innerJoin(
        favorites,
        and(
          eq(coffees.id, favorites.coffeeId),
          eq(favorites.userId, userId)
        )
      )
      .orderBy(desc(favorites.createdAt));
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const result = await db.insert(favorites).values(insertFavorite).returning();
    return result[0];
  }

  async removeFavorite(userId: number, coffeeId: number): Promise<boolean> {
    const result = await db.delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.coffeeId, coffeeId)
        )
      );
    return result?.rowCount ? result.rowCount > 0 : false;
  }

  async isFavorite(userId: number, coffeeId: number): Promise<boolean> {
    const result = await db.select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.coffeeId, coffeeId)
        )
      );
    return result.length > 0;
  }

  // Follow methods
  async getFollowingByUser(userId: number): Promise<User[]> {
    return await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      createdAt: users.createdAt,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      password: users.password,
      googleId: users.googleId,
      facebookId: users.facebookId,
      appleId: users.appleId,
      authProvider: users.authProvider,
      resetToken: users.resetToken,
      resetTokenExpires: users.resetTokenExpires
    })
      .from(users)
      .innerJoin(
        follows,
        and(
          eq(users.id, follows.followedId),
          eq(follows.followerId, userId)
        )
      )
      .orderBy(users.username);
  }

  async getFollowersByUser(userId: number): Promise<User[]> {
    return await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      createdAt: users.createdAt,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      password: users.password,
      googleId: users.googleId,
      facebookId: users.facebookId,
      appleId: users.appleId,
      authProvider: users.authProvider,
      resetToken: users.resetToken,
      resetTokenExpires: users.resetTokenExpires
    })
      .from(users)
      .innerJoin(
        follows,
        and(
          eq(users.id, follows.followerId),
          eq(follows.followedId, userId)
        )
      )
      .orderBy(users.username);
  }

  async followUser(insertFollow: InsertFollow): Promise<Follow> {
    const result = await db.insert(follows).values(insertFollow).returning();
    return result[0];
  }

  async unfollowUser(followerId: number, followedId: number): Promise<boolean> {
    const result = await db.delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followedId, followedId)
        )
      );
    return result?.rowCount ? result.rowCount > 0 : false;
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    const result = await db.select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followedId, followedId)
        )
      );
    return result.length > 0;
  }

  // Collection methods
  async getCollectionsByUser(userId: number): Promise<Collection[]> {
    return await db.select()
      .from(collections)
      .where(eq(collections.userId, userId))
      .orderBy(collections.name);
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    const result = await db.select().from(collections).where(eq(collections.id, id));
    return result[0];
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const result = await db.insert(collections).values(insertCollection).returning();
    return result[0];
  }

  // Collection items methods
  async getCollectionItems(collectionId: number): Promise<Coffee[]> {
    return await db.select({
      id: coffees.id,
      name: coffees.name,
      roaster: coffees.roaster,
      origin: coffees.origin,
      roastLevel: coffees.roastLevel,
      submittedBy: coffees.submittedBy,
      createdAt: coffees.createdAt,
      region: coffees.region,
      processMethod: coffees.processMethod,
      description: coffees.description,
      imageUrl: coffees.imageUrl,
      barcode: coffees.barcode
    })
      .from(coffees)
      .innerJoin(
        collectionItems,
        and(
          eq(coffees.id, collectionItems.coffeeId),
          eq(collectionItems.collectionId, collectionId)
        )
      )
      .orderBy(desc(collectionItems.createdAt));
  }

  async addCoffeeToCollection(insertCollectionItem: InsertCollectionItem): Promise<CollectionItem> {
    const result = await db.insert(collectionItems).values(insertCollectionItem).returning();
    return result[0];
  }

  async removeCoffeeFromCollection(collectionId: number, coffeeId: number): Promise<boolean> {
    const result = await db.delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.coffeeId, coffeeId)
        )
      );
    return result?.rowCount ? result.rowCount > 0 : false;
  }
  
  // Shop product methods
  async getShopProduct(id: number): Promise<ShopProduct | undefined> {
    const result = await db.select().from(shopProducts).where(eq(shopProducts.id, id));
    return result[0];
  }

  async getShopProducts(limit = 10, offset = 0): Promise<ShopProduct[]> {
    return await db.select()
      .from(shopProducts)
      .orderBy(desc(shopProducts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getFeaturedShopProducts(): Promise<ShopProduct[]> {
    return await db.select()
      .from(shopProducts)
      .where(eq(shopProducts.featured, true))
      .orderBy(desc(shopProducts.createdAt));
  }

  async createShopProduct(product: InsertShopProduct): Promise<ShopProduct> {
    const result = await db.insert(shopProducts).values(product).returning();
    return result[0];
  }

  async updateShopProduct(id: number, product: Partial<ShopProduct>): Promise<ShopProduct | undefined> {
    const result = await db.update(shopProducts)
      .set(product)
      .where(eq(shopProducts.id, id))
      .returning();
    return result[0];
  }

  // Mascot guide methods
  async getMascotGuide(id: number): Promise<MascotGuide | undefined> {
    const result = await db.select().from(mascotGuides).where(eq(mascotGuides.id, id));
    return result[0];
  }

  async getMascotGuideByName(name: string): Promise<MascotGuide | undefined> {
    const result = await db.select().from(mascotGuides).where(eq(mascotGuides.name, name));
    return result[0];
  }

  async getMascotGuides(): Promise<MascotGuide[]> {
    return await db.select()
      .from(mascotGuides)
      .orderBy(desc(mascotGuides.priority));
  }

  async createMascotGuide(guide: InsertMascotGuide): Promise<MascotGuide> {
    const result = await db.insert(mascotGuides).values(guide).returning();
    return result[0];
  }

  async updateMascotGuide(id: number, guide: Partial<MascotGuide>): Promise<MascotGuide | undefined> {
    const result = await db.update(mascotGuides)
      .set(guide)
      .where(eq(mascotGuides.id, id))
      .returning();
    return result[0];
  }

  // Quiz methods
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const result = await db.select().from(quizQuestions).where(eq(quizQuestions.id, id));
    return result[0];
  }

  async getQuizQuestionByQuestionId(questionId: string): Promise<QuizQuestion | undefined> {
    const result = await db.select().from(quizQuestions).where(eq(quizQuestions.questionId, questionId));
    return result[0];
  }

  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return await db.select()
      .from(quizQuestions)
      .orderBy(asc(quizQuestions.sortOrder));
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const result = await db.insert(quizQuestions).values(question).returning();
    return result[0];
  }

  async getQuizOptions(questionId: string): Promise<QuizOption[]> {
    return await db.select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, questionId))
      .orderBy(asc(quizOptions.sortOrder));
  }

  async createQuizOption(option: InsertQuizOption): Promise<QuizOption> {
    const result = await db.insert(quizOptions).values(option).returning();
    return result[0];
  }
  
  // Initialize all default data
  async initializeDefaultData(): Promise<void> {
    try {
      // Initialize flavor notes (brewing methods removed)
      await this.initFlavorNotes();
      
      try {
        // Initialize quiz questions and options - catch errors to prevent app from crashing
        await this.initQuizQuestions();
      } catch (error) {
        console.error("Error initializing quiz questions:", error.message);
      }
      
      try {
        // Initialize mascot guides - catch errors to prevent app from crashing
        await this.initMascotGuides();
      } catch (error) {
        console.error("Error initializing mascot guides:", error.message);
      }
      
      try {
        // Initialize shop products - catch errors to prevent app from crashing
        await this.initShopProducts();
      } catch (error) {
        console.error("Error initializing shop products:", error.message);
      }
    } catch (error) {
      // Log the error but don't crash the server
      console.error("Error initializing data:", error.message);
    }
    
    console.log("Database initialization completed - errors were handled gracefully");
  }

  // Initialize quiz questions and options
  private async initQuizQuestions(): Promise<void> {
    // Get all existing question IDs for checking
    const existingQuestions = await db.select({ questionId: quizQuestions.questionId }).from(quizQuestions);
    const existingQuestionIds = new Set(existingQuestions.map(q => q.questionId));
    
    // Get all existing option IDs for checking - include questionId for composite key check
    const existingOptions = await db.select({ 
      questionId: quizOptions.questionId, 
      optionId: quizOptions.optionId 
    }).from(quizOptions);
    const existingOptionIds = new Set(existingOptions.map(o => `${o.questionId}-${o.optionId}`));
    
    const questions = [
      {
        questionId: 'roast-level',
        question: 'What roast level do you prefer?',
        description: 'Roast levels affect the flavor, acidity, and body of coffee.',
        answerType: 'single',
        sortOrder: 1,
        options: [
          { optionId: 'light', text: 'Light Roast', value: 'light', icon: '☀️', sortOrder: 1 },
          { optionId: 'medium', text: 'Medium Roast', value: 'medium', icon: '🌤️', sortOrder: 2 },
          { optionId: 'medium-dark', text: 'Medium-Dark Roast', value: 'medium-dark', icon: '⛅', sortOrder: 3 },
          { optionId: 'dark', text: 'Dark Roast', value: 'dark', icon: '🌙', sortOrder: 4 }
        ]
      },
      {
        questionId: 'flavor-profile',
        question: 'What flavor profiles do you enjoy?',
        description: 'Select all that apply to your taste preferences.',
        answerType: 'multiple',
        sortOrder: 2,
        options: [
          { optionId: 'fruity', text: 'Fruity & Bright', value: 'fruity', icon: '🍎', sortOrder: 1 },
          { optionId: 'nutty', text: 'Nutty & Chocolatey', value: 'nutty', icon: '🍫', sortOrder: 2 },
          { optionId: 'floral', text: 'Floral & Aromatic', value: 'floral', icon: '🌸', sortOrder: 3 },
          { optionId: 'earthy', text: 'Earthy & Spicy', value: 'earthy', icon: '🌱', sortOrder: 4 },
          { optionId: 'caramel', text: 'Caramel & Sweet', value: 'caramel', icon: '🍯', sortOrder: 5 }
        ]
      },
      {
        questionId: 'brewing-method',
        question: 'How do you usually brew your coffee?',
        description: 'Different brewing methods extract different flavors.',
        answerType: 'single',
        sortOrder: 3,
        options: [
          { optionId: 'espresso', text: 'Espresso Machine', value: 'espresso', icon: '☕', sortOrder: 1 },
          { optionId: 'pour-over', text: 'Pour Over (Chemex, V60)', value: 'pour-over', icon: '⏳', sortOrder: 2 },
          { optionId: 'french-press', text: 'French Press', value: 'french-press', icon: '🧇', sortOrder: 3 },
          { optionId: 'drip', text: 'Drip Coffee Maker', value: 'drip', icon: '⏲️', sortOrder: 4 },
          { optionId: 'cold-brew', text: 'Cold Brew', value: 'cold-brew', icon: '🧊', sortOrder: 5 }
        ]
      },
      {
        questionId: 'time-of-day',
        question: 'When do you typically drink coffee?',
        description: 'Your preferred time might affect what coffee works best for you.',
        answerType: 'single',
        sortOrder: 4,
        options: [
          { optionId: 'morning', text: 'Morning (6am-10am)', value: 'morning', icon: '🌅', sortOrder: 1 },
          { optionId: 'midday', text: 'Midday (10am-2pm)', value: 'midday', icon: '🌞', sortOrder: 2 },
          { optionId: 'afternoon', text: 'Afternoon (2pm-6pm)', value: 'afternoon', icon: '🌇', sortOrder: 3 },
          { optionId: 'evening', text: 'Evening (6pm+)', value: 'evening', icon: '🌃', sortOrder: 4 }
        ]
      },
      {
        questionId: 'caffeine',
        question: 'Do you prefer regular or decaf coffee?',
        description: 'We have excellent options for both preferences.',
        answerType: 'single',
        sortOrder: 5,
        options: [
          { optionId: 'regular', text: 'Regular (Caffeinated)', value: 'regular', icon: '⚡', sortOrder: 1 },
          { optionId: 'decaf', text: 'Decaf', value: 'decaf', icon: '😴', sortOrder: 2 },
          { optionId: 'either', text: 'Either is fine', value: 'either', icon: '🤷', sortOrder: 3 }
        ]
      }
    ];
    
    // Insert questions and their options
    for (const question of questions) {
      // Skip if this question already exists
      if (!existingQuestionIds.has(question.questionId)) {
        // Insert the question
        await db.insert(quizQuestions).values({
          questionId: question.questionId,
          question: question.question,
          description: question.description,
          answerType: question.answerType,
          sortOrder: question.sortOrder
        });
      }
      
      // Insert the options for this question
      for (const option of question.options) {
        // Skip if this option already exists by checking the composite key (questionId + optionId)
        const optionKey = `${question.questionId}-${option.optionId}`;
        if (!existingOptionIds.has(optionKey)) {
          await db.insert(quizOptions).values({
            questionId: question.questionId,
            optionId: option.optionId,
            text: option.text,
            value: option.value,
            icon: option.icon,
            sortOrder: option.sortOrder
          });
        }
      }
    }
  }

  // Initialize mascot guides
  private async initMascotGuides(): Promise<void> {
    // Get all existing guide names for checking
    const existingGuides = await db.select({ name: mascotGuides.name }).from(mascotGuides);
    const existingGuideNames = new Set(existingGuides.map(g => g.name));
    
    const guides = [
      {
        name: "welcome",
        message: "I'm your coffee companion! I'll guide you through the app and help you discover amazing coffees. Let's get started!",
        mood: "waving",
        position: "center",
        priority: 100,
        condition: "first-visit",
        autoHide: true,
        hideAfter: 5000
      },
      {
        name: "add-coffee",
        message: "Found a great coffee? Tap here to add it to your collection. You can scan the barcode or enter details manually.",
        mood: "excited",
        position: "bottom-right",
        priority: 90,
        condition: "empty-collection",
        autoHide: true,
        hideAfter: 5000
      },
      {
        name: "try-quiz",
        message: "Not sure what coffee you'll like? Try our quick quiz and get personalized recommendations!",
        mood: "thinking",
        position: "top-right",
        priority: 85,
        condition: "new-user",
        autoHide: true,
        hideAfter: 5000
      },
      {
        name: "review-coffee",
        message: "Share your thoughts on coffees you've tried. Your reviews help others discover great beans!",
        mood: "happy",
        position: "bottom-left",
        priority: 80,
        condition: "after-add-coffee",
        autoHide: true,
        hideAfter: 5000
      },
      {
        name: "flavor-notes",
        message: "Coffee has complex flavors! Look for notes like 'fruity', 'chocolate', or 'nutty' to find beans you'll love.",
        mood: "explaining",
        position: "top-left",
        priority: 75,
        condition: "viewing-coffee",
        autoHide: true,
        hideAfter: 5000
      },
      {
        name: "roast-levels",
        message: "Light roasts are bright and acidic, medium roasts are balanced, and dark roasts are bold and rich.",
        mood: "explaining",
        position: "top-right",
        priority: 70,
        condition: "viewing-roast-info",
        autoHide: true,
        hideAfter: 5000
      },
      {
        name: "brewing-tips",
        message: "For the best cup, use freshly ground beans, filtered water at 195-205°F, and the right coffee-to-water ratio.",
        mood: "explaining",
        position: "bottom-right",
        priority: 65,
        condition: "after-review",
        autoHide: true,
        hideAfter: 5000
      }
    ];
    
    // Insert guides
    for (const guide of guides) {
      // Skip if this guide already exists
      if (!existingGuideNames.has(guide.name)) {
        await db.insert(mascotGuides).values(guide);
      }
    }
  }
  
  // Initialize shop products
  private async initShopProducts(): Promise<void> {
    // Get all existing product titles for checking
    const existingProducts = await db.select({ title: shopProducts.title }).from(shopProducts);
    const existingProductTitles = new Set(existingProducts.map(p => p.title));
    
    const products = [
      {
        title: "CoffeesIQ Signature Blend",
        description: "Our house blend featuring beans from Ethiopia and Colombia, with notes of chocolate, caramel, and citrus. Medium roast.",
        price: "1499", // $14.99
        image: "/images/products/signature-blend.jpg",
        rating: 4.8,
        inStock: true,
        featured: true,
        roastLevel: "medium",
        origin: "Ethiopia, Colombia",
        weight: "340" // 12oz
      },
      {
        title: "Ethiopia Yirgacheffe",
        description: "Single-origin Ethiopian beans with vibrant floral and citrus notes. Light-medium roast perfect for pour-over brewing.",
        price: "1699",
        image: "/images/products/ethiopia-yirgacheffe.jpg",
        rating: 4.7,
        inStock: true,
        featured: true,
        roastLevel: "light-medium",
        origin: "Ethiopia",
        weight: "340"
      },
      {
        title: "Sumatra Mandheling",
        description: "Bold, earthy Indonesian beans with notes of dark chocolate, cedar, and spice. Dark roast ideal for espresso or French press.",
        price: "1599",
        image: "/images/products/sumatra-mandheling.jpg",
        rating: 4.6,
        inStock: true,
        featured: false,
        roastLevel: "dark",
        origin: "Indonesia",
        weight: "340"
      },
      {
        title: "Costa Rica Tarrazu",
        description: "Balanced, bright Costa Rican beans with notes of honey, orange, and almond. Medium roast for all brewing methods.",
        price: "1599",
        image: "/images/products/costa-rica-tarrazu.jpg",
        rating: 4.9,
        inStock: true,
        featured: true,
        roastLevel: "medium",
        origin: "Costa Rica",
        weight: "340"
      },
      {
        title: "CoffeesIQ Ceramic Mug",
        description: "12oz ceramic mug featuring our mascot and logo. Microwave and dishwasher safe.",
        price: "1299",
        image: "/images/products/ceramic-mug.jpg",
        rating: 4.5,
        inStock: true,
        featured: true,
        roastLevel: "n/a",
        origin: "n/a",
        weight: "350"
      },
      {
        title: "Pour-Over Coffee Dripper",
        description: "Ceramic pour-over dripper with our logo. Makes 1-2 cups of perfectly extracted coffee.",
        price: "2499",
        image: "/images/products/pour-over-dripper.jpg",
        rating: 4.6,
        inStock: true,
        featured: false,
        roastLevel: "n/a",
        origin: "n/a",
        weight: "400"
      },
      {
        title: "Hand Coffee Grinder",
        description: "Adjustable ceramic burr grinder for the freshest coffee. Compact and perfect for travel.",
        price: "3999",
        image: "/images/products/hand-grinder.jpg",
        rating: 4.7,
        inStock: true,
        featured: true,
        roastLevel: "n/a",
        origin: "n/a",
        weight: "450"
      },
      {
        title: "Digital Coffee Scale",
        description: "Precision scale with timer function. Measure your coffee and water accurately for the perfect cup.",
        price: "2999",
        image: "/images/products/digital-scale.jpg",
        rating: 4.8,
        inStock: true,
        featured: false,
        roastLevel: "n/a",
        origin: "n/a",
        weight: "250"
      }
    ];
    
    // Insert products
    for (const product of products) {
      // Skip if this product already exists
      if (!existingProductTitles.has(product.title)) {
        await db.insert(shopProducts).values(product);
      }
    }
  }
}