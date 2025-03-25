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

  // BrewingMethods functionality removed

  // Initialize flavor notes
  private async initFlavorNotes() {
    const existingNotes = await db.select().from(flavorNotes);
    
    // Only initialize if the table is empty
    if (existingNotes.length === 0) {
      const notes = [
        "Floral", "Fruity", "Citrus", "Chocolate", "Nutty", 
        "Caramel", "Honey", "Berry", "Earthy", "Spicy"
      ];

      for (const note of notes) {
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

  // Quiz option methods
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
    // Initialize flavor notes (brewing methods removed)
    await this.initFlavorNotes();
    
    // Initialize quiz questions and options
    await this.initQuizQuestions();
    
    // Initialize mascot guides
    await this.initMascotGuides();
    
    // Initialize shop products
    await this.initShopProducts();
  }
  
  // Initialize quiz questions and options
  private async initQuizQuestions(): Promise<void> {
    const existingQuestions = await db.select().from(quizQuestions);
    
    // Only initialize if the table is empty
    if (existingQuestions.length === 0) {
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
          question: 'What flavor notes do you enjoy?',
          description: 'Select all that apply.',
          answerType: 'multiple',
          sortOrder: 2,
          options: [
            { optionId: 'fruity', text: 'Fruity', value: 'fruity', icon: '🍎', sortOrder: 1 },
            { optionId: 'nutty', text: 'Nutty', value: 'nutty', icon: '🥜', sortOrder: 2 },
            { optionId: 'chocolate', text: 'Chocolate', value: 'chocolate', icon: '🍫', sortOrder: 3 },
            { optionId: 'caramel', text: 'Caramel', value: 'caramel', icon: '🍯', sortOrder: 4 },
            { optionId: 'floral', text: 'Floral', value: 'floral', icon: '🌸', sortOrder: 5 },
            { optionId: 'spicy', text: 'Spicy', value: 'spicy', icon: '🌶️', sortOrder: 6 }
          ]
        },
        {
          questionId: 'acidity',
          question: 'How do you feel about acidity?',
          description: 'Acidity contributes to the brightness and liveliness of coffee.',
          answerType: 'single',
          sortOrder: 3,
          options: [
            { optionId: 'low', text: 'Low acidity', value: 'low', icon: '😌', sortOrder: 1 },
            { optionId: 'medium', text: 'Medium acidity', value: 'medium', icon: '😊', sortOrder: 2 },
            { optionId: 'high', text: 'High acidity', value: 'high', icon: '😃', sortOrder: 3 }
          ]
        },
        {
          questionId: 'brew-method',
          question: 'How do you usually brew your coffee?',
          description: 'Different brewing methods highlight different characteristics.',
          answerType: 'single',
          sortOrder: 4,
          options: [
            { optionId: 'drip', text: 'Drip/Pour Over', value: 'drip', icon: '☕', sortOrder: 1 },
            { optionId: 'espresso', text: 'Espresso', value: 'espresso', icon: '💪', sortOrder: 2 },
            { optionId: 'french-press', text: 'French Press', value: 'french-press', icon: '🧋', sortOrder: 3 },
            { optionId: 'aeropress', text: 'AeroPress', value: 'aeropress', icon: '🥤', sortOrder: 4 },
            { optionId: 'cold-brew', text: 'Cold Brew', value: 'cold-brew', icon: '❄️', sortOrder: 5 }
          ]
        },
        {
          questionId: 'origin',
          question: 'Do you have a preferred coffee origin?',
          description: 'Coffee beans from different regions have distinctive characteristics.',
          answerType: 'single',
          sortOrder: 5,
          options: [
            { optionId: 'latin-america', text: 'Latin America', value: 'latin-america', icon: '🌎', sortOrder: 1 },
            { optionId: 'africa', text: 'Africa', value: 'africa', icon: '🌍', sortOrder: 2 },
            { optionId: 'asia', text: 'Asia/Pacific', value: 'asia', icon: '🌏', sortOrder: 3 },
            { optionId: 'no-preference', text: 'No preference', value: 'no-preference', icon: '🌐', sortOrder: 4 }
          ]
        }
      ];
      
      // Insert questions and their options
      for (const question of questions) {
        const insertedQuestion = await db.insert(quizQuestions).values({
          questionId: question.questionId,
          question: question.question,
          description: question.description,
          answerType: question.answerType,
          sortOrder: question.sortOrder
        }).returning();
        
        // Insert options for this question
        for (const option of question.options) {
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
    const existingGuides = await db.select().from(mascotGuides);
    
    // Only initialize if the table is empty
    if (existingGuides.length === 0) {
      const guides = [
        {
          name: 'welcome',
          message: "Welcome to CoffeesIQ! I'm your coffee guide. I'll help you discover amazing coffees!",
          mood: 'waving',
          position: 'bottom-right',
          priority: 100,
          delay: 1000,
          autoHide: false,
          hideAfter: null,
          condition: "pathname === '/' && visited.length === 0"
        },
        {
          name: 'home-page',
          message: "This is your coffee dashboard. Explore new flavors, track your favorites, and connect with other coffee lovers!",
          mood: 'explaining',
          position: 'bottom-left',
          priority: 90,
          delay: null,
          autoHide: false,
          hideAfter: null,
          condition: "pathname === '/' && !visited.includes('home-page')"
        },
        {
          name: 'quiz-intro',
          message: "Ready to find your perfect coffee match? Answer a few questions and I'll help you discover new favorites!",
          mood: 'excited',
          position: 'top-right',
          priority: 85,
          delay: null,
          autoHide: false,
          hideAfter: null,
          condition: "pathname === '/quiz' && !visited.includes('quiz-intro')"
        },
        {
          name: 'add-coffee',
          message: "Adding a new coffee? You can scan the barcode or enter details manually. Don't forget to add flavor notes!",
          mood: 'explaining',
          position: 'top-right',
          priority: 80,
          delay: null,
          autoHide: false,
          hideAfter: null,
          condition: "pathname === '/add-coffee' && !visited.includes('add-coffee')"
        }
      ];
      
      for (const guide of guides) {
        await db.insert(mascotGuides).values(guide);
      }
    }
  }
  
  // Initialize shop products
  private async initShopProducts(): Promise<void> {
    const existingProducts = await db.select().from(shopProducts);
    
    // Only initialize if the table is empty
    if (existingProducts.length === 0) {
      const products = [
        {
          title: "Ethiopian Yirgacheffe",
          description: "Bright and fruity with notes of blueberry and citrus.",
          price: "16.99",
          image: "/images/coffees/ethiopian.jpg",
          rating: 4.8,
          origin: "Ethiopia",
          roastLevel: "Light",
          weight: "12 oz",
          inStock: true,
          featured: true
        },
        {
          title: "Colombian Supremo",
          description: "Sweet and balanced with caramel and nutty notes.",
          price: "14.99",
          image: "/images/coffees/colombian.jpg",
          rating: 4.5,
          origin: "Colombia",
          roastLevel: "Medium",
          weight: "12 oz",
          inStock: true,
          featured: false
        },
        {
          title: "Sumatra Mandheling",
          description: "Earthy and full-bodied with notes of chocolate and cedar.",
          price: "15.99",
          image: "/images/coffees/sumatra.jpg",
          rating: 4.3,
          origin: "Indonesia",
          roastLevel: "Dark",
          weight: "12 oz",
          inStock: true,
          featured: false
        },
        {
          title: "Breakfast Blend",
          description: "Smooth and bright morning blend with citrus notes.",
          price: "13.99",
          image: "/images/coffees/breakfast.jpg",
          rating: 4.2,
          origin: "Central America Blend",
          roastLevel: "Medium",
          weight: "12 oz",
          inStock: true,
          featured: true
        },
        {
          title: "Guatemala Antigua",
          description: "Complex with chocolate, spice and smoky undertones.",
          price: "17.99",
          image: "/images/coffees/guatemala.jpg",
          rating: 4.7,
          origin: "Guatemala",
          roastLevel: "Medium",
          weight: "12 oz",
          inStock: false,
          featured: false
        },
        {
          title: "Espresso Roast",
          description: "Bold and rich with caramel sweetness.",
          price: "15.99",
          image: "/images/coffees/espresso.jpg",
          rating: 4.6,
          origin: "Brazil/Colombia Blend",
          roastLevel: "Dark",
          weight: "12 oz",
          inStock: true,
          featured: false
        },
        {
          title: "Costa Rica Tarrazu",
          description: "Bright acidity with honey and citrus notes.",
          price: "16.99",
          image: "/images/coffees/costa-rica.jpg",
          rating: 4.4,
          origin: "Costa Rica",
          roastLevel: "Medium-Light",
          weight: "12 oz",
          inStock: true,
          featured: true
        },
        {
          title: "Swiss Water Decaf",
          description: "Full flavor with notes of chocolate and nuts without the caffeine.",
          price: "15.99",
          image: "/images/coffees/decaf.jpg",
          rating: 4.1,
          origin: "Colombian",
          roastLevel: "Medium",
          weight: "12 oz",
          inStock: true,
          featured: false
        }
      ];
      
      for (const product of products) {
        await db.insert(shopProducts).values(product);
      }
    }
  }
}