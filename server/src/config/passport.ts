import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { IUser, UserModel } from "../models/user.js";
import { clientRepository } from "../repositories/clientRepository.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userRepo = new clientRepository(UserModel);

        let user = await userRepo.findOne({email: profile.emails![0].value });
        if (!user) {
            user = await userRepo.create({
                name: profile.displayName,
                email: profile.emails![0].value,
                isVerified: true, // Google accounts are verified
                password: "", // No password needed for Google sign-in
            });
        }
        done(null, user);
    }catch (err: unknown) {
  done(
    err instanceof Error
      ? err
      : new Error("Unknown error"),
    undefined
  );
}
}));

passport.serializeUser((user, done) => {
    const u = user as IUser; // safely cast
    done(null, u._id);
});

passport.deserializeUser(async (id: string, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
});
