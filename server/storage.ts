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
  shopProducts, ShopProduct, InsertShopProduct,
  mascotGuides, MascotGuide, InsertMascotGuide,
  quizQuestions, QuizQuestion, InsertQuizQuestion,
  quizOptions, QuizOption, InsertQuizOption
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  getUserByAppleId(appleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Coffee methods
  getCoffee(id: number): Promise<Coffee | undefined>;
  getCoffees(limit?: number, offset?: number): Promise<Coffee[]>;
  getCoffeesByUser(userId: number): Promise<Coffee[]>;
  searchCoffees(query: string): Promise<Coffee[]>;
  createCoffee(coffee: InsertCoffee): Promise<Coffee>;
  updateCoffee(id: number, coffee: Partial<Coffee>): Promise<Coffee | undefined>;
  
  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getReviews(limit?: number, offset?: number): Promise<Review[]>;
  getReviewsByCoffee(coffeeId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Flavor notes methods
  getFlavorNote(id: number): Promise<FlavorNote | undefined>;
  getFlavorNotes(): Promise<FlavorNote[]>;
  getFlavorNotesByCoffee(coffeeId: number): Promise<FlavorNote[]>;
  getFlavorNotesByReview(reviewId: number): Promise<FlavorNote[]>;
  createFlavorNote(flavorNote: InsertFlavorNote): Promise<FlavorNote>;
  
  // Coffee flavor notes methods
  addFlavorNoteToCoffee(coffeeFlavorNote: InsertCoffeeFlavorNote): Promise<CoffeeFlavorNote>;
  
  // Review flavor notes methods
  addFlavorNoteToReview(reviewFlavorNote: InsertReviewFlavorNote): Promise<ReviewFlavorNote>;
  
  // No brewing methods - removed
  
  // Favorites methods
  getFavoritesByUser(userId: number): Promise<Coffee[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, coffeeId: number): Promise<boolean>;
  isFavorite(userId: number, coffeeId: number): Promise<boolean>;
  
  // Follow methods
  getFollowingByUser(userId: number): Promise<User[]>;
  getFollowersByUser(userId: number): Promise<User[]>;
  followUser(follow: InsertFollow): Promise<Follow>;
  unfollowUser(followerId: number, followedId: number): Promise<boolean>;
  isFollowing(followerId: number, followedId: number): Promise<boolean>;
  
  // Collection methods
  getCollectionsByUser(userId: number): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // Collection items methods
  getCollectionItems(collectionId: number): Promise<Coffee[]>;
  addCoffeeToCollection(collectionItem: InsertCollectionItem): Promise<CollectionItem>;
  removeCoffeeFromCollection(collectionId: number, coffeeId: number): Promise<boolean>;
  
  // Shop product methods
  getShopProduct(id: number): Promise<ShopProduct | undefined>;
  getShopProducts(limit?: number, offset?: number): Promise<ShopProduct[]>;
  getFeaturedShopProducts(): Promise<ShopProduct[]>;
  createShopProduct(product: InsertShopProduct): Promise<ShopProduct>;
  updateShopProduct(id: number, product: Partial<ShopProduct>): Promise<ShopProduct | undefined>;
  
  // Mascot guide methods
  getMascotGuide(id: number): Promise<MascotGuide | undefined>;
  getMascotGuideByName(name: string): Promise<MascotGuide | undefined>;
  getMascotGuides(): Promise<MascotGuide[]>;
  createMascotGuide(guide: InsertMascotGuide): Promise<MascotGuide>;
  updateMascotGuide(id: number, guide: Partial<MascotGuide>): Promise<MascotGuide | undefined>;
  
  // Quiz methods
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  getQuizQuestionByQuestionId(questionId: string): Promise<QuizQuestion | undefined>;
  getQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  
  // Quiz option methods
  getQuizOptions(questionId: string): Promise<QuizOption[]>;
  createQuizOption(option: InsertQuizOption): Promise<QuizOption>;
  
  // Initialize default data
  initializeDefaultData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private coffees: Map<number, Coffee>;
  private reviews: Map<number, Review>;
  private flavorNotes: Map<number, FlavorNote>;
  private coffeeFlavorNotes: Map<number, CoffeeFlavorNote>;
  private reviewFlavorNotes: Map<number, ReviewFlavorNote>;
  private favorites: Map<number, Favorite>;
  private follows: Map<number, Follow>;
  private collections: Map<number, Collection>;
  private collectionItems: Map<number, CollectionItem>;
  private shopProducts: Map<number, ShopProduct>;
  private mascotGuides: Map<number, MascotGuide>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizOptions: Map<number, QuizOption>;
  
  sessionStore: session.Store;
  private userIdCounter: number;
  private coffeeIdCounter: number;
  private reviewIdCounter: number;
  private flavorNoteIdCounter: number;
  private coffeeFlavorNoteIdCounter: number;
  private reviewFlavorNoteIdCounter: number;
  private favoriteIdCounter: number;
  private followIdCounter: number;
  private collectionIdCounter: number;
  private collectionItemIdCounter: number;
  private shopProductIdCounter: number;
  private mascotGuideIdCounter: number;
  private quizQuestionIdCounter: number;
  private quizOptionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.coffees = new Map();
    this.reviews = new Map();
    this.flavorNotes = new Map();
    this.coffeeFlavorNotes = new Map();
    this.reviewFlavorNotes = new Map();
    this.favorites = new Map();
    this.follows = new Map();
    this.collections = new Map();
    this.collectionItems = new Map();
    this.shopProducts = new Map();
    this.mascotGuides = new Map();
    this.quizQuestions = new Map();
    this.quizOptions = new Map();
    
    this.userIdCounter = 1;
    this.coffeeIdCounter = 1;
    this.reviewIdCounter = 1;
    this.flavorNoteIdCounter = 1;
    this.coffeeFlavorNoteIdCounter = 1;
    this.reviewFlavorNoteIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.followIdCounter = 1;
    this.collectionIdCounter = 1;
    this.collectionItemIdCounter = 1;
    this.shopProductIdCounter = 1;
    this.mascotGuideIdCounter = 1;
    this.quizQuestionIdCounter = 1;
    this.quizOptionIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Initialize flavor notes
    this.initFlavorNotes();
    
    // Initialize the rest of the default data
    this.initShopProducts();
    this.initMascotGuides();
    this.initQuizQuestions();
  }

  // Brewing methods removed

  // Initialize flavor notes
  private initFlavorNotes() {
    const notes = [
      "Floral", "Fruity", "Citrus", "Chocolate", "Nutty", 
      "Caramel", "Honey", "Berry", "Earthy", "Spicy"
    ];

    notes.forEach(note => {
      const id = this.flavorNoteIdCounter++;
      this.flavorNotes.set(id, { id, name: note });
    });
  }
  
  // Initialize shop products
  private initShopProducts() {
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
      }
    ];
    
    products.forEach((product, index) => {
      const id = index + 1;
      const now = new Date();
      this.shopProducts.set(id, { 
        ...product, 
        id,
        createdAt: now,
        updatedAt: now
      });
      this.shopProductIdCounter = id + 1;
    });
  }
  
  // Initialize mascot guides
  private initMascotGuides() {
    const guides = [
      {
        name: "welcome",
        message: "Welcome to CoffeesIQ! I'm your coffee guide. I'll help you discover amazing coffees!",
        mood: "waving",
        position: "bottom-right",
        priority: 100,
        delay: 1000,
        autoHide: false,
        hideAfter: null,
        condition: "pathname === '/' && visited.length === 0"
      },
      {
        name: "home-page",
        message: "This is your coffee dashboard. Explore new flavors, track your favorites, and connect with other coffee lovers!",
        mood: "explaining",
        position: "bottom-left",
        priority: 90,
        delay: null,
        autoHide: false,
        hideAfter: null,
        condition: "pathname === '/' && !visited.includes('home-page')"
      },
      {
        name: "quiz-intro",
        message: "Ready to find your perfect coffee match? Answer a few questions and I'll help you discover new favorites!",
        mood: "excited",
        position: "top-right",
        priority: 85,
        delay: null,
        autoHide: false,
        hideAfter: null,
        condition: "pathname === '/quiz' && !visited.includes('quiz-intro')"
      }
    ];
    
    guides.forEach((guide, index) => {
      const id = index + 1;
      const now = new Date();
      this.mascotGuides.set(id, { 
        ...guide, 
        id,
        createdAt: now
      });
      this.mascotGuideIdCounter = id + 1;
    });
  }
  
  // Initialize quiz questions and options
  private initQuizQuestions() {
    const questions = [
      {
        questionId: "roast-level",
        question: "What roast level do you prefer?",
        description: "Roast levels affect the flavor, acidity, and body of coffee.",
        answerType: "single",
        sortOrder: 1,
        options: [
          { optionId: "light", text: "Light Roast", value: "light", icon: "☀️", sortOrder: 1 },
          { optionId: "medium", text: "Medium Roast", value: "medium", icon: "🌤️", sortOrder: 2 },
          { optionId: "medium-dark", text: "Medium-Dark Roast", value: "medium-dark", icon: "⛅", sortOrder: 3 },
          { optionId: "dark", text: "Dark Roast", value: "dark", icon: "🌙", sortOrder: 4 }
        ]
      },
      {
        questionId: "flavor-profile",
        question: "What flavor notes do you enjoy?",
        description: "Select all that apply.",
        answerType: "multiple",
        sortOrder: 2,
        options: [
          { optionId: "fruity", text: "Fruity", value: "fruity", icon: "🍎", sortOrder: 1 },
          { optionId: "nutty", text: "Nutty", value: "nutty", icon: "🥜", sortOrder: 2 },
          { optionId: "chocolate", text: "Chocolate", value: "chocolate", icon: "🍫", sortOrder: 3 },
          { optionId: "caramel", text: "Caramel", value: "caramel", icon: "🍯", sortOrder: 4 }
        ]
      }
    ];
    
    let optionIdCounter = 1;
    
    questions.forEach((question, qIndex) => {
      const qId = qIndex + 1;
      const now = new Date();
      const { options, ...questionData } = question;
      
      this.quizQuestions.set(qId, { 
        ...questionData,
        id: qId,
        createdAt: now
      });
      
      this.quizQuestionIdCounter = qId + 1;
      
      // Add options for this question
      question.options.forEach((option) => {
        const oId = optionIdCounter++;
        const now = new Date();
        this.quizOptions.set(oId, { 
          ...option,
          id: oId,
          questionId: question.questionId,
          createdAt: now
        });
      });
      
      this.quizOptionIdCounter = optionIdCounter;
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId
    );
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.facebookId === facebookId
    );
  }

  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.appleId === appleId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      bio: null,
      avatarUrl: null,
      displayName: insertUser.displayName || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Coffee methods
  async getCoffee(id: number): Promise<Coffee | undefined> {
    return this.coffees.get(id);
  }

  async getCoffees(limit = 10, offset = 0): Promise<Coffee[]> {
    return Array.from(this.coffees.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getCoffeesByUser(userId: number): Promise<Coffee[]> {
    return Array.from(this.coffees.values())
      .filter(coffee => coffee.submittedBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async searchCoffees(query: string): Promise<Coffee[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.coffees.values())
      .filter(coffee => 
        coffee.name.toLowerCase().includes(lowercaseQuery) ||
        coffee.roaster.toLowerCase().includes(lowercaseQuery) ||
        coffee.origin.toLowerCase().includes(lowercaseQuery) ||
        (coffee.region && coffee.region.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCoffee(insertCoffee: InsertCoffee): Promise<Coffee> {
    const id = this.coffeeIdCounter++;
    const now = new Date();
    const coffee: Coffee = {
      ...insertCoffee,
      id,
      createdAt: now,
      region: insertCoffee.region || null,
      processMethod: insertCoffee.processMethod || null,
      description: insertCoffee.description || null,
      imageUrl: insertCoffee.imageUrl || null,
      barcode: insertCoffee.barcode || null
    };
    this.coffees.set(id, coffee);
    return coffee;
  }

  async updateCoffee(id: number, coffeeData: Partial<Coffee>): Promise<Coffee | undefined> {
    const coffee = await this.getCoffee(id);
    if (!coffee) return undefined;

    const updatedCoffee = { ...coffee, ...coffeeData };
    this.coffees.set(id, updatedCoffee);
    return updatedCoffee;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviews(limit = 10, offset = 0): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getReviewsByCoffee(coffeeId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.coffeeId === coffeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: now,
      imageUrl: insertReview.imageUrl || null,
      brewingMethod: insertReview.brewingMethod || null,
      review: insertReview.review || null
    };
    this.reviews.set(id, review);
    return review;
  }

  // Flavor notes methods
  async getFlavorNote(id: number): Promise<FlavorNote | undefined> {
    return this.flavorNotes.get(id);
  }

  async getFlavorNotes(): Promise<FlavorNote[]> {
    return Array.from(this.flavorNotes.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFlavorNotesByCoffee(coffeeId: number): Promise<FlavorNote[]> {
    const coffeeFlavorNoteIds = Array.from(this.coffeeFlavorNotes.values())
      .filter(cfn => cfn.coffeeId === coffeeId)
      .map(cfn => cfn.flavorNoteId);

    return Array.from(this.flavorNotes.values())
      .filter(note => coffeeFlavorNoteIds.includes(note.id));
  }

  async getFlavorNotesByReview(reviewId: number): Promise<FlavorNote[]> {
    const reviewFlavorNoteIds = Array.from(this.reviewFlavorNotes.values())
      .filter(rfn => rfn.reviewId === reviewId)
      .map(rfn => rfn.flavorNoteId);

    return Array.from(this.flavorNotes.values())
      .filter(note => reviewFlavorNoteIds.includes(note.id));
  }

  async createFlavorNote(insertFlavorNote: InsertFlavorNote): Promise<FlavorNote> {
    const id = this.flavorNoteIdCounter++;
    const flavorNote: FlavorNote = {
      ...insertFlavorNote,
      id
    };
    this.flavorNotes.set(id, flavorNote);
    return flavorNote;
  }

  // Coffee flavor notes methods
  async addFlavorNoteToCoffee(insertCoffeeFlavorNote: InsertCoffeeFlavorNote): Promise<CoffeeFlavorNote> {
    const id = this.coffeeFlavorNoteIdCounter++;
    const coffeeFlavorNote: CoffeeFlavorNote = {
      ...insertCoffeeFlavorNote,
      id
    };
    this.coffeeFlavorNotes.set(id, coffeeFlavorNote);
    return coffeeFlavorNote;
  }

  // Review flavor notes methods
  async addFlavorNoteToReview(insertReviewFlavorNote: InsertReviewFlavorNote): Promise<ReviewFlavorNote> {
    const id = this.reviewFlavorNoteIdCounter++;
    const reviewFlavorNote: ReviewFlavorNote = {
      ...insertReviewFlavorNote,
      id
    };
    this.reviewFlavorNotes.set(id, reviewFlavorNote);
    return reviewFlavorNote;
  }

  // Brewing methods removed

  // Favorites methods
  async getFavoritesByUser(userId: number): Promise<Coffee[]> {
    const favoriteIds = Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId)
      .map(fav => fav.coffeeId);

    return Array.from(this.coffees.values())
      .filter(coffee => favoriteIds.includes(coffee.id));
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const now = new Date();
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: now
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, coffeeId: number): Promise<boolean> {
    const favoriteEntry = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.coffeeId === coffeeId);

    if (favoriteEntry) {
      return this.favorites.delete(favoriteEntry.id);
    }
    return false;
  }

  async isFavorite(userId: number, coffeeId: number): Promise<boolean> {
    return !!Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.coffeeId === coffeeId);
  }

  // Follow methods
  async getFollowingByUser(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followedId);

    return Array.from(this.users.values())
      .filter(user => followingIds.includes(user.id));
  }

  async getFollowersByUser(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(follow => follow.followedId === userId)
      .map(follow => follow.followerId);

    return Array.from(this.users.values())
      .filter(user => followerIds.includes(user.id));
  }

  async followUser(insertFollow: InsertFollow): Promise<Follow> {
    const id = this.followIdCounter++;
    const now = new Date();
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: now
    };
    this.follows.set(id, follow);
    return follow;
  }

  async unfollowUser(followerId: number, followedId: number): Promise<boolean> {
    const followEntry = Array.from(this.follows.values())
      .find(follow => follow.followerId === followerId && follow.followedId === followedId);

    if (followEntry) {
      return this.follows.delete(followEntry.id);
    }
    return false;
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    return !!Array.from(this.follows.values())
      .find(follow => follow.followerId === followerId && follow.followedId === followedId);
  }

  // Collection methods
  async getCollectionsByUser(userId: number): Promise<Collection[]> {
    return Array.from(this.collections.values())
      .filter(collection => collection.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const now = new Date();
    const collection: Collection = {
      ...insertCollection,
      id,
      createdAt: now,
      description: insertCollection.description || null,
      imageUrl: insertCollection.imageUrl || null
    };
    this.collections.set(id, collection);
    return collection;
  }

  // Collection items methods
  async getCollectionItems(collectionId: number): Promise<Coffee[]> {
    const coffeeIds = Array.from(this.collectionItems.values())
      .filter(item => item.collectionId === collectionId)
      .map(item => item.coffeeId);

    return Array.from(this.coffees.values())
      .filter(coffee => coffeeIds.includes(coffee.id));
  }

  async addCoffeeToCollection(insertCollectionItem: InsertCollectionItem): Promise<CollectionItem> {
    const id = this.collectionItemIdCounter++;
    const now = new Date();
    const collectionItem: CollectionItem = {
      ...insertCollectionItem,
      id,
      createdAt: now
    };
    this.collectionItems.set(id, collectionItem);
    return collectionItem;
  }

  async removeCoffeeFromCollection(collectionId: number, coffeeId: number): Promise<boolean> {
    const collectionItemEntry = Array.from(this.collectionItems.values())
      .find(item => item.collectionId === collectionId && item.coffeeId === coffeeId);

    if (collectionItemEntry) {
      return this.collectionItems.delete(collectionItemEntry.id);
    }
    return false;
  }
  
  // Shop product methods
  async getShopProduct(id: number): Promise<ShopProduct | undefined> {
    return this.shopProducts.get(id);
  }

  async getShopProducts(limit = 10, offset = 0): Promise<ShopProduct[]> {
    return Array.from(this.shopProducts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getFeaturedShopProducts(): Promise<ShopProduct[]> {
    return Array.from(this.shopProducts.values())
      .filter(product => product.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createShopProduct(insertProduct: InsertShopProduct): Promise<ShopProduct> {
    const id = this.shopProductIdCounter++;
    const now = new Date();
    const product: ShopProduct = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.shopProducts.set(id, product);
    return product;
  }

  async updateShopProduct(id: number, productData: Partial<ShopProduct>): Promise<ShopProduct | undefined> {
    const product = await this.getShopProduct(id);
    if (!product) return undefined;

    const updatedProduct = { 
      ...product, 
      ...productData,
      updatedAt: new Date()
    };
    this.shopProducts.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // Mascot guide methods
  async getMascotGuide(id: number): Promise<MascotGuide | undefined> {
    return this.mascotGuides.get(id);
  }

  async getMascotGuideByName(name: string): Promise<MascotGuide | undefined> {
    return Array.from(this.mascotGuides.values())
      .find(guide => guide.name === name);
  }

  async getMascotGuides(): Promise<MascotGuide[]> {
    return Array.from(this.mascotGuides.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  async createMascotGuide(insertGuide: InsertMascotGuide): Promise<MascotGuide> {
    const id = this.mascotGuideIdCounter++;
    const now = new Date();
    const guide: MascotGuide = {
      ...insertGuide,
      id,
      createdAt: now
    };
    this.mascotGuides.set(id, guide);
    return guide;
  }

  async updateMascotGuide(id: number, guideData: Partial<MascotGuide>): Promise<MascotGuide | undefined> {
    const guide = await this.getMascotGuide(id);
    if (!guide) return undefined;

    const updatedGuide = { ...guide, ...guideData };
    this.mascotGuides.set(id, updatedGuide);
    return updatedGuide;
  }
  
  // Quiz methods
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestions.get(id);
  }

  async getQuizQuestionByQuestionId(questionId: string): Promise<QuizQuestion | undefined> {
    return Array.from(this.quizQuestions.values())
      .find(question => question.questionId === questionId);
  }

  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values())
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.quizQuestionIdCounter++;
    const now = new Date();
    const question: QuizQuestion = {
      ...insertQuestion,
      id,
      createdAt: now
    };
    this.quizQuestions.set(id, question);
    return question;
  }
  
  // Quiz option methods
  async getQuizOptions(questionId: string): Promise<QuizOption[]> {
    return Array.from(this.quizOptions.values())
      .filter(option => option.questionId === questionId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async createQuizOption(insertOption: InsertQuizOption): Promise<QuizOption> {
    const id = this.quizOptionIdCounter++;
    const now = new Date();
    const option: QuizOption = {
      ...insertOption,
      id,
      createdAt: now
    };
    this.quizOptions.set(id, option);
    return option;
  }
  
  // Initialize all default data
  async initializeDefaultData(): Promise<void> {
    // Initialize flavor notes
    this.initFlavorNotes();
    
    // Initialize shop products
    this.initShopProducts();
    
    // Initialize mascot guides
    this.initMascotGuides();
    
    // Initialize quiz questions and options
    this.initQuizQuestions();
  }
}

// Import DatabaseStorage for PostgreSQL support
import { DatabaseStorage } from './database-storage';

// Use PostgreSQL storage in production, fallback to memory storage for development
const usePostgres = process.env.DATABASE_URL !== undefined;
export const storage = usePostgres ? new DatabaseStorage() : new MemStorage();