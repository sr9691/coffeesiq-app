import { Coffee, Review, FlavorNote, User } from "@shared/schema";

// Constants for recommendation weights
const WEIGHTS = {
  FLAVOR_MATCH: 2.0,        // Weight for matching flavor notes
  ORIGIN_MATCH: 1.5,        // Weight for matching origin
  ROAST_MATCH: 1.0,         // Weight for matching roast level
  PROCESS_MATCH: 0.7,       // Weight for matching process method
  RATING_INFLUENCE: 0.5,    // Weight for high ratings
  SIMILAR_USER_BOOST: 1.2,  // Multiplier for recommendations from similar users
};

// Types for recommendation system
export interface RecommendationContext {
  userPreferences: UserPreference;
  coffeeRatings?: Record<number, number>; // User's ratings (coffeeId -> rating)
  favorites?: number[];                   // IDs of coffees user has favorited
  recentlyViewed?: number[];              // IDs of recently viewed coffees
  quizResults?: QuizResults;              // User's quiz answers
}

export interface UserPreference {
  favoriteOrigins?: string[];           // Origins user tends to prefer
  favoriteRoastLevels?: string[];       // Roast levels user tends to prefer
  favoriteProcessMethods?: string[];    // Process methods user tends to prefer
  favoriteFlavorProfiles?: number[];    // IDs of flavor notes user tends to prefer
}

export interface QuizResults {
  preferredRoast?: string;              // Light, Medium, Dark
  preferredFlavors?: string[];          // Sweet, Fruity, Earthy, etc.
  brewingMethod?: string;               // Pour over, Espresso, French press, etc.
  consumptionTime?: string;             // Morning, Afternoon, Evening
  caffeinePreference?: string;          // Regular, Decaf
}

export interface ScoredCoffee {
  coffee: Coffee;
  score: number;
  matchReason: string[];
}

/**
 * Calculates coffee recommendations based on user preferences and behavior
 * @param coffees All available coffees
 * @param reviews All available reviews
 * @param flavorNotes All available flavor notes
 * @param context User's preferences and behavior context
 * @returns Scored and sorted coffee recommendations
 */
export function getRecommendations(
  coffees: Coffee[],
  reviews: Review[],
  flavorNotes: FlavorNote[],
  context: RecommendationContext
): ScoredCoffee[] {
  // Skip coffees user has already rated or favorited
  const excludeIds = new Set([
    ...(context.coffeeRatings ? Object.keys(context.coffeeRatings).map(Number) : []),
    ...(context.favorites || []),
  ]);
  
  // Score each coffee
  const scoredCoffees = coffees
    .filter(coffee => !excludeIds.has(coffee.id))
    .map(coffee => {
      const score = calculateScore(coffee, reviews, flavorNotes, context);
      return {
        coffee,
        score: score.value,
        matchReason: score.reasons,
      };
    });
  
  // Sort by score (highest first) and return
  return scoredCoffees.sort((a, b) => b.score - a.score);
}

/**
 * Calculate a score for a coffee based on how well it matches user preferences
 */
function calculateScore(
  coffee: Coffee,
  reviews: Review[],
  flavorNotes: FlavorNote[],
  context: RecommendationContext
): { value: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  
  // Base score - newer coffees get a small boost
  const daysOld = coffee.createdAt
    ? Math.floor((Date.now() - new Date(coffee.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 90; // Default to 3 months old if no date
  const freshnessFactor = Math.max(0.8, 1 - daysOld / 365); // Reduces by 20% max for 1 year old coffees
  score += freshnessFactor;
  
  // Origin match
  if (context.userPreferences.favoriteOrigins?.includes(coffee.origin)) {
    score += WEIGHTS.ORIGIN_MATCH;
    reasons.push(`From ${coffee.origin}, one of your favorite origins`);
  }
  
  // Roast level match
  if (context.userPreferences.favoriteRoastLevels?.includes(coffee.roastLevel)) {
    score += WEIGHTS.ROAST_MATCH;
    reasons.push(`${coffee.roastLevel} roast matches your preference`);
  } else if (context.quizResults?.preferredRoast) {
    // Use quiz results if available
    if (mapQuizRoastToRoastLevel(context.quizResults.preferredRoast).includes(coffee.roastLevel)) {
      score += WEIGHTS.ROAST_MATCH;
      reasons.push(`${coffee.roastLevel} roast matches your quiz preference`);
    }
  }
  
  // Process method match
  if (context.userPreferences.favoriteProcessMethods?.includes(coffee.processMethod)) {
    score += WEIGHTS.PROCESS_MATCH;
    reasons.push(`${coffee.processMethod} process matches your preference`);
  }
  
  // Flavor notes match
  const coffeeFlavorNoteIds = getCoffeeFlavorNotes(coffee.id, reviews, flavorNotes);
  const userFlavorPreferences = context.userPreferences.favoriteFlavorProfiles || [];
  
  // Count matches with user's flavor preferences
  const flavorMatchCount = coffeeFlavorNoteIds.filter(id => 
    userFlavorPreferences.includes(id)
  ).length;
  
  if (flavorMatchCount > 0) {
    const flavorBoost = Math.min(3, flavorMatchCount) * WEIGHTS.FLAVOR_MATCH;
    score += flavorBoost;
    
    if (flavorMatchCount === 1) {
      reasons.push("Has a flavor note you like");
    } else {
      reasons.push(`Has ${flavorMatchCount} flavor notes you like`);
    }
  }
  
  // Quiz results matching
  if (context.quizResults?.preferredFlavors && context.quizResults.preferredFlavors.length > 0) {
    const matchingQuizFlavors = matchQuizFlavorsToNotes(
      context.quizResults.preferredFlavors,
      getCoffeeFlavorNoteNames(coffee.id, reviews, flavorNotes)
    );
    
    if (matchingQuizFlavors > 0) {
      score += matchingQuizFlavors * WEIGHTS.FLAVOR_MATCH * 0.8; // Slightly lower weight than explicit preferences
      reasons.push(`Matches ${matchingQuizFlavors} flavor preferences from your quiz`);
    }
  }
  
  // Average rating boost
  const coffeeReviews = reviews.filter(review => review.coffeeId === coffee.id);
  if (coffeeReviews.length > 0) {
    const avgRating = coffeeReviews.reduce((sum, review) => sum + review.rating, 0) / coffeeReviews.length;
    const ratingBoost = Math.max(0, avgRating - 3) * WEIGHTS.RATING_INFLUENCE; // Only boost for above average (>3) ratings
    score += ratingBoost;
    
    if (avgRating >= 4.5) {
      reasons.push("Highly rated by the community");
    } else if (avgRating >= 4.0) {
      reasons.push("Well rated by the community");
    }
  }
  
  return { value: score, reasons };
}

// Helper function to get flavor note IDs for a coffee
function getCoffeeFlavorNotes(
  coffeeId: number, 
  reviews: Review[], 
  flavorNotes: FlavorNote[]
): number[] {
  // This would need to be adapted to your actual data structure
  // Here we assume we can extract flavor notes from reviews
  const relevantReviews = reviews.filter(review => review.coffeeId === coffeeId);
  
  // In a real system, we would extract the flavor notes from the review or from a coffee_flavor_notes junction table
  // For demo purposes, we'll return a simple subset of flavor notes
  return relevantReviews
    .flatMap(review => review.flavorNotes || [])
    .filter((id, index, self) => self.indexOf(id) === index); // Deduplicate
}

// Helper function to get flavor note names for a coffee
function getCoffeeFlavorNoteNames(
  coffeeId: number, 
  reviews: Review[], 
  flavorNotes: FlavorNote[]
): string[] {
  const noteIds = getCoffeeFlavorNotes(coffeeId, reviews, flavorNotes);
  return noteIds
    .map(id => flavorNotes.find(note => note.id === id)?.name || "")
    .filter(name => name !== "");
}

// Map quiz roast preference to actual roast levels
function mapQuizRoastToRoastLevel(quizRoast: string): string[] {
  switch (quizRoast.toLowerCase()) {
    case 'light':
      return ['Light', 'Medium-Light'];
    case 'medium':
      return ['Medium-Light', 'Medium', 'Medium-Dark'];
    case 'dark':
      return ['Medium-Dark', 'Dark'];
    default:
      return [];
  }
}

// Map quiz flavor preferences to actual flavor notes
function matchQuizFlavorsToNotes(quizFlavors: string[], coffeeFlavorNames: string[]): number {
  let matches = 0;
  
  // Map of quiz flavor categories to keywords in actual flavor notes
  const flavorMap: Record<string, string[]> = {
    'sweet': ['sweet', 'sugar', 'honey', 'caramel', 'chocolate', 'toffee', 'candy'],
    'fruity': ['fruit', 'berry', 'citrus', 'apple', 'cherry', 'orange', 'lemon', 'tropical'],
    'nutty': ['nut', 'almond', 'hazelnut', 'peanut', 'walnut'],
    'earthy': ['earth', 'woody', 'forest', 'tobacco', 'leather', 'spice'],
    'floral': ['floral', 'jasmine', 'rose', 'lavender', 'herb'],
    'acidic': ['bright', 'acidic', 'tangy', 'sour', 'tart'],
  };
  
  for (const quizFlavor of quizFlavors) {
    const keywords = flavorMap[quizFlavor.toLowerCase()] || [];
    
    // Check if any coffee flavor note contains keywords from this category
    const hasMatch = coffeeFlavorNames.some(noteName => 
      keywords.some(keyword => noteName.toLowerCase().includes(keyword))
    );
    
    if (hasMatch) {
      matches++;
    }
  }
  
  return matches;
}

/**
 * Generate recommendations based on quiz results
 */
export function getQuizBasedRecommendations(
  coffees: Coffee[],
  reviews: Review[],
  flavorNotes: FlavorNote[],
  quizResults: QuizResults
): ScoredCoffee[] {
  // Create a recommendation context based on quiz results
  const context: RecommendationContext = {
    userPreferences: {
      favoriteRoastLevels: mapQuizRoastToRoastLevel(quizResults.preferredRoast || ""),
      // We'll let the engine match flavor preferences directly from quiz results
    },
    quizResults,
  };
  
  return getRecommendations(coffees, reviews, flavorNotes, context);
}

/**
 * Extract user preferences from their rating and review history
 */
export function extractUserPreferences(
  userReviews: Review[],
  coffees: Coffee[],
  flavorNotes: FlavorNote[]
): UserPreference {
  // Only consider coffees the user rated highly (4 stars or more)
  const highlyRatedReviews = userReviews.filter(review => review.rating >= 4);
  
  // Get coffees that were highly rated
  const highlyRatedCoffees = highlyRatedReviews.map(review => 
    coffees.find(coffee => coffee.id === review.coffeeId)
  ).filter((coffee): coffee is Coffee => coffee !== undefined);
  
  // Extract favorite origins
  const originCounts = countOccurrences(highlyRatedCoffees.map(c => c.origin));
  const favoriteOrigins = getTopElements(originCounts, 3);
  
  // Extract favorite roast levels
  const roastCounts = countOccurrences(highlyRatedCoffees.map(c => c.roastLevel));
  const favoriteRoastLevels = getTopElements(roastCounts, 2);
  
  // Extract favorite process methods
  const processCounts = countOccurrences(highlyRatedCoffees.map(c => c.processMethod));
  const favoriteProcessMethods = getTopElements(processCounts, 2);
  
  // Extract favorite flavor notes
  const flavorNoteCounts: Record<number, number> = {}; 
  
  // Count occurrences of flavor notes in highly rated reviews
  for (const review of highlyRatedReviews) {
    if (review.flavorNotes) {
      for (const noteId of review.flavorNotes) {
        flavorNoteCounts[noteId] = (flavorNoteCounts[noteId] || 0) + 1;
      }
    }
  }
  
  // Get top flavor notes by ID
  const favoriteFlavorProfiles = Object.entries(flavorNoteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => parseInt(id));
  
  return {
    favoriteOrigins,
    favoriteRoastLevels,
    favoriteProcessMethods,
    favoriteFlavorProfiles,
  };
}

// Helper function to count occurrences of elements in an array
function countOccurrences<T>(arr: T[]): Record<string, number> {
  return arr.reduce((acc, curr) => {
    const key = String(curr);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// Helper function to get the top N elements by count
function getTopElements(counts: Record<string, number>, n: number): string[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key);
}