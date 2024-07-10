import express from "express";
import authRouter from "./routers/authRouter.mjs"
import userRouter from "./routers/userRouter.mjs"
import publicationRouter from "./routers/publicationRouter.mjs"
import userPreferences  from "./routers/userPreferencesRouter.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./sessionStrategy/local-strategy.mjs"
import cors from "cors";
import fileUpload from "express-fileupload";

const app= express();
//mongodb://mongodb/musikat
mongoose
	.connect("mongodb://mongodb/musikat", {connectTimeoutMS: 10000})
	.then(() => console.log("Connected to data base"))
	.catch((err) => console.log(`Error: ${err}`))

app.use(cors({
	origin: process.env.CORS_URL || "https://pacheco.chillan.ubiobio.cl:120",
	credentials: true
}));

app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(session({
	secret: "oidfiopdsfoihasdiohfiopawhfoihiowepfhiphgviohfiogu",
	saveUninitialized: false,
	resave: false,
	cookie: {
		maxAge: 60000 * 60 * 24,
		secure: false
	},
	store: MongoStore.create({
		client: mongoose.connection.getClient()
	}),
}));
app.use(passport.initialize());
app.use(passport.session());

//poner al final
app.use(authRouter);
app.use(userRouter);
app.use(publicationRouter);
app.use(userPreferences);


const PORT = process.env.PORT || 3000;


app.listen(PORT, (err) => {
	if (err) {
	  console.error(`Error starting server: ${err.message}`);
	} else {
	  console.log(`Express Server - puerto ${PORT} online`);
	}
});

