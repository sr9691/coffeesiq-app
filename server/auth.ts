import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as AppleStrategy } from "passport-apple";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables
dotenv.config();

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Helper function to handle OAuth user creation or login
async function findOrCreateOAuthUser(profile: any, provider: string, providerIdField: string): Promise<SelectUser> {
  // First, try to find a user with the provider ID
  let user;
  
  // Query based on provider type
  if (provider === 'google') {
    user = await storage.getUserByGoogleId(profile.id);
  } else if (provider === 'facebook') {
    user = await storage.getUserByFacebookId(profile.id);
  } else if (provider === 'apple') {
    user = await storage.getUserByAppleId(profile.id);
  }
  
  // If user exists, return it
  if (user) {
    return user;
  }
  
  // If user doesn't exist, check if email is already registered
  // Many OAuth providers return email in different formats
  const email = 
    profile.emails && profile.emails.length > 0
      ? profile.emails[0].value
      : (profile.email || null);
      
  if (email) {
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      // Update existing user with OAuth ID
      const updatedUser = await storage.updateUser(existingUser.id, {
        [providerIdField]: profile.id,
        authProvider: provider
      });
      // If update failed, return the existing user
      if (!updatedUser) {
        return existingUser;
      }
      return updatedUser;
    }
  }
  
  // Create new user if no existing user found
  const displayName = profile.displayName || (profile.name ? `${profile.name.givenName} ${profile.name.familyName}`.trim() : '');
  const username = email ? email.split('@')[0] : `${provider}_user_${Date.now()}`;
  
  const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  // Parse to the insert schema format
  const userData = insertUserSchema.parse({
    username,
    email: email || `${username}@example.com`, // Fallback email if none provided
    password: null, // OAuth users don't have passwords
    displayName: displayName || username,
    authProvider: provider,
    avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : randomAvatar,
    [providerIdField]: profile.id
  });

  const newUser = await storage.createUser(userData);
  
  return newUser;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "bean-rate-super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Set up OAuth strategies if credentials are provided
  
  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"]
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser(profile, 'google', 'googleId');
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }
  
  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser(profile, 'facebook', 'facebookId');
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }
  
  // Apple OAuth Strategy
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID) {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      callbackURL: "/auth/apple/callback",
      // Using a private key from environment variable if provided
      privateKeyString: process.env.APPLE_PRIVATE_KEY || undefined
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser(profile, 'apple', 'appleId');
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }

  passport.use(
    new LocalStrategy({
      usernameField: 'email', // Use email for authentication
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false);
        }
        
        // Check if the user has a password (should be the case for local auth)
        if (!user.password) {
          return done(null, false, { message: "User has no password set. Try using social login." });
        }
        
        // Verify password
        if (!(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, username } = req.body;
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Remove the password from the response
      const { password, ...userWithoutPassword } = user;
      
      req.login(user, (err: Error | null) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid email or password" });
      }
      
      req.login(user, (err: Error | null) => {
        if (err) return next(err);
        
        // Remove the password from the response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err: Error | null) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove the password from the response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // OAuth routes
  
  // Google OAuth routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get("/auth/google", passport.authenticate("google", { 
      scope: ["profile", "email"] 
    }));
    
    app.get("/auth/google/callback", 
      passport.authenticate("google", { 
        failureRedirect: "/auth",
        session: true 
      }),
      (req, res) => {
        // Successful authentication
        res.redirect("/");
      }
    );
  }
  
  // Facebook OAuth routes
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    app.get("/auth/facebook", passport.authenticate("facebook", { 
      scope: ["email", "public_profile"] 
    }));
    
    app.get("/auth/facebook/callback", 
      passport.authenticate("facebook", { 
        failureRedirect: "/auth",
        session: true 
      }),
      (req, res) => {
        // Successful authentication
        res.redirect("/");
      }
    );
  }
  
  // Apple OAuth routes
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID) {
    app.get("/auth/apple", passport.authenticate("apple"));
    
    app.get("/auth/apple/callback", 
      passport.authenticate("apple", { 
        failureRedirect: "/auth",
        session: true 
      }),
      (req, res) => {
        // Successful authentication
        res.redirect("/");
      }
    );
  }
}
