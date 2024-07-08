import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/userSchema.mjs"
import { comparePassword } from "../utils/bcrypt.mjs";

passport.serializeUser((user, done) => {
    console.log(`serializing ${user.id}`);
    done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
    try {
        console.log(`deserializando usuario: ${user}`);
		const findUser = await User.findById(user);
		if (!findUser) {
            throw new Error("User Not Found");
        }
		done(null, {id: findUser.id, username: findUser.username, email: findUser.email});
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
    new Strategy({ usernameField: "email"}, async (email, password, done) => {
        try{
            const findUser = await User.findOne({email});

            if(!(findUser && comparePassword(password, findUser.password))){
                throw new Error("Bad credentials");
            }
            done(null, {id: findUser.id});
        }catch (err){
            done(err, null);
        }
    })
);