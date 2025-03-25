declare module 'passport-apple' {
  import { Strategy as PassportStrategy } from 'passport';
  
  export interface StrategyOptions {
    clientID: string;
    teamID: string;
    keyID: string;
    callbackURL: string;
    privateKeyPath?: string;
    privateKeyString?: string;
    passReqToCallback?: boolean;
    scope?: string[];
  }

  export interface VerifyCallback {
    (req: any, accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void): void;
    (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void): void;
  }

  export class Strategy implements PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyCallback);
    name: string;
    authenticate(req: any, options?: any): void;
  }
}