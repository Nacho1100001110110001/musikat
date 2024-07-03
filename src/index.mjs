import express from "express";
import authRouter from "./routers/authRouter.mjs"
import userRouter from "./routers/userRouter.mjs"
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./sessionStrategy/local-strategy.mjs"
import { isAuthtenticated } from "./utils/middlewares.mjs";
import cors from "cors";


const app= express();

mongoose
	.connect("mongodb://mongodb/musikat", {connectTimeoutMS: 10000})
	.then(() => console.log("Connected to data base"))
	.catch((err) => console.log(`Error: ${err}`))

app.use(cors({
	origin:"http://localhost",
	credentials: true
}));


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


const PORT = process.env.PORT || 3000;

app.get("/api/", 
	isAuthtenticated, 
	(req, res) => {
	console.log(req.session);
	console.log(req.session.passport.user);
	console.log(req.session.id);
	console.log(req.user);
	res.status(200).send({msg: req.user});
});

app.listen(PORT, ()=>{
    console.log('Express Server - puerto 3000 online');
});

/*app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Reemplaza con la URL de tu aplicación Angular
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Expose-Headers', 'Set-Cookie, Authorization, Content-Length'); // Cabeceras a exponer
	next();
});*/
