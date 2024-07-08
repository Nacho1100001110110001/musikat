import { Router } from "express";
import { matchedData, validationResult, checkSchema } from "express-validator";
import { createUserValidationSchema, loginUserValidationSchema } from "../utils/validatorSchemas.mjs";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { hashPassword } from "../utils/bcrypt.mjs";
import passport from "passport";
import { authenticationErrorHandler } from "../utils/middlewares.mjs";
import { UserProfile } from "../mongoose/schemas/userProfileSchema.mjs";
import mongoose from "mongoose";
import { UserPreferences } from "../mongoose/schemas/userPreferencesSchema.mjs";

const router = Router();

router.post(
    "/api/auth/register",
    checkSchema(createUserValidationSchema),
    async (request, response) => {
        const result = validationResult(request);

        if(!result.isEmpty()){
            return response.status(400).send({error: result.array()});
        }
        const sessionPromise =  mongoose.startSession();

        const data = matchedData(request);
        const newUser = new User(data);
        newUser.password = hashPassword(newUser.password);

        const session = await sessionPromise;
 
        session.startTransaction();

        try {
            const savedUser = await newUser.save();
            if(!savedUser) throw Error();

            const newUserProfile = new UserProfile(defaultUserProfile(savedUser));
            const savedUserProfile = await newUserProfile.save();
            if(!savedUserProfile) throw Error();

            const newUserPreferences = new UserPreferences({
                userId: savedUser.id,
                likedArtists: [],
                likedSongs: []
            });
            const savedUserPreferences = newUserPreferences.save();
            if(!savedUserPreferences) throw Error();

            await session.commitTransaction();
            response.status(201).send({msg: "created"});
        }catch (err) {
            await session.abortTransaction();
            response.status(400).send({error: "El usuario y esta registrado"});
        }finally{
            session.endSession();
        }
        
    }
);

router.post("/api/auth/login",
    passport.authenticate("local"),
    authenticationErrorHandler,
    (request, response) => {
		return response.status(200).send({msg: "ok"});
	}
);

router.post("/api/auth/logout", (request, response) => {
	if (!request.user) {
        return response.status(401).send({error: "unauthorized"});
    }
	request.logout((err) => {
		if (err) return response.status(500).send({error: "no se pudo hacer logout"});
        request.session.destroy((err) => {
            if (err) return response.status(500).send({error: "no se pudo hacer logout"});
        });
		response.status(200).send({msg: "ok"});
	});
});

router.get("/api/auth/status", (request, response) => {
	return request.user ? response.status(200).send(request.user) : response.status(401).send({error: "unauthorized"});;
});

function defaultUserProfile(user){
    return {
          userId: user.id,
          username: user.username,
          birthDate: new Date(),
          favoriteSong:"",
          favoriteArtist: "",
          favoriteGenre: "",
          followed: [],
          friends: [],
          blocked: [],
          requested: []
        }
}

export default router;