import { Router, request, response } from "express";
import { isAuthtenticated } from "../utils/middlewares.mjs";
import { UserProfile } from "../mongoose/schemas/userProfileSchema.mjs";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { check, checkSchema, matchedData, validationResult } from "express-validator";
import { updateUserProfileSchema } from "../utils/validatorSchemas.mjs";
import path from "path";
import fs from 'fs';
import mongoose from "mongoose";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profilePicPath = path.join(__dirname, '../..', 'uploads/profilepics');

const router = Router();

router.put("/api/user/profile",
    isAuthtenticated,
    checkSchema(updateUserProfileSchema),
    async (request, response) => {
        const result = validationResult(request);
        if(!result.isEmpty()){
            return response.status(400).send({error: result.array()});
        }
        try {
            const data = matchedData(request);
            const updatedUserProfile = await UserProfile.findOneAndUpdate(
                { userId: request.user.id }, 
                data, 
                {new: true}
            );
            if(!updatedUserProfile) throw new Error("No se encontrar el perfil");
            response.status(200).send(userProfileDto(updatedUserProfile));
        } catch (err) {
            response.status(400).send({error: err.message});
        }
        
    }
);


router.post("/api/user/profilepic",
    isAuthtenticated,
    async (request, response) => {
        if(!request.files){
            return response.status(400).json({
                error: "Debe proporcionar imagen"
            });
        }
        const image = request.files.imagen;
        const extention = path.extname(image.name);

        const validExtentions = [".png", ".jpg", ".gif", ".jpeg"];

        if(validExtentions.indexOf(extention) < 0){
            return response.status(400).json({
                error: "Extension no valida"
            })
        }

        const fileName = request.user.id;
        const filePath = path.join(profilePicPath, fileName);
        const ImagePath = filePath + extention;

        let success;

        image.mv(ImagePath , err => {
            if(err){
                success = false;
                console.log(`estoy dentro del error ${success}`);
            }else{
                fs.writeFileSync(`${filePath}.meta`, extention);
                success = true;
                console.log(`estoy dentro del else ${success}`);
            }
        });

        console.log(`estoy afuera ${success}`);

        if(success){
            return response.status(201).send({
                url: "poner url" + path
            });
        }

        return response.status(500).json({
            error: "No se pudo subir el archivo"
        });  
    }
);

router.get("/api/user/profilepic/:userId",
    check('userId')
      .isMongoId().withMessage('ID con formato invalido')
      .notEmpty().withMessage('El ID de usuario es requerido'),
    (request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const data = matchedData(request);
        const filePath = path.join(profilePicPath, data.userId);
        const metaPaht = filePath + ".meta";

        let extention;

        if (fs.existsSync(metaPaht)) {
            try {
                extention = fs.readFileSync(`${filePath}.meta`, 'utf-8');
            } catch (err) {
                return response.status(404).send({error: 'Image not found'});
            }
        } else {
            return response.status(404).send({error: 'Image not found'});
        }


        const fullPath = `${filePath}${extention}`;

        if (fs.existsSync(fullPath)) {
            return response.sendFile(fullPath);
        } else {
            return response.status(404).send({error: 'Image not found'});
        }
    }
);

router.get("/api/users/:otherUserName", 
    isAuthtenticated,
    check("otherUserName")
      .isString().withMessage("El nombre de usuario tiene que ser un string")
      .notEmpty().withMessage("el nombre de usuario no debe estar vacio"),
    async (request, response) =>{
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const otherUserName = request.params.otherUserName;
        try {
            const findedUsers = await User.find({ username: { $regex: otherUserName, $options: 'i' } })
                .select("id username");
            if(!findedUsers){
                return response.status(400).send({error: "No se puedo encontrar el usuario"});
            } 
            return response.status(200).send(findedUsers);
        }catch (err) {
            return response.status(400).send({error: err.message});
        }
    }
)

router.get("/api/user/profile",
    isAuthtenticated,
    async (request, response) =>{
        try {
            const findUserProfile = await UserProfile.findOne({userId: request.user.id});
            if(!findUserProfile){
                return response.status(400).send({error: "Perfil no encontrado"});
            } 
            return response.status(200).send(userProfileDto(findUserProfile));
        }catch (err) {
            return response.status(400).send({error: err.message});
        }
        
    }
);

router.get("/api/user/profile/:otherUserName",
    isAuthtenticated,
    check("otherUserName")
      .isString().withMessage("El nombre de usuario tiene que ser un string")
      .notEmpty().withMessage("el nombre de usuario no debe estar vacio"),
    async (request, response) =>{
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const otherUserName = request.params.otherUserName;
        try {
            const findUserProfile = await UserProfile.findOne({username: otherUserName});
            if(!findUserProfile){
                return response.status(400).send({error: "No se puedo encontrar el perfil"});
            } 
            return response.status(200).send(otherUserProfileDto(findUserProfile));
        }catch (err) {
            return response.status(400).send({error: err.message});
        }
        
    }
);

router.put("/api/user/friends/accept/:friendId",
    isAuthtenticated,
    check('friendId')
      .isMongoId().withMessage('ID con formato invalido')
      .notEmpty().withMessage('El ID de usuario es requerido'),
    async (request, response) => {

        const result = validationResult(request);
        if (!result.isEmpty()) {
            return response.status(400).send({ error: result.array() });
        }
        const friendId = request.params.friendId;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const newFriend = await User.findById(friendId);
            const { username } = newFriend;
            if(!newFriend){
                await session.abortTransaction();
                return response.status(400).send({error: "Falla al agregar amogus"});
            }

            const updatedFriendList = await UserProfile.findOneAndUpdate(
                { userId: request.user.id },
                { $addToSet: { friends: {userId: friendId, username} } },
                { new: true }
                );
             
            const updatedRequestList = await UserProfile.findOneAndUpdate(
                { userId: request.user.id },
                { $addToSet: { requested: {userId: friendId} } },
                { new: true }
            );

            const newFriendProfile = await UserProfile.findOneAndUpdate(
                { userId: friendId },
                { $addToSet: { friends: {userId: request.user.id, username: request.user.username} } },
                { new: true }
            );

            if(!updatedFriendList || !updatedRequestList || !newFriendProfile){
                await session.abortTransaction();
                return response.status(400).send({error: "Falla al agregar amogus"});
                
            }
            await session.commitTransaction();
            return response.status(200).send(userProfileDto(updatedRequestList));
            
        } catch (err) {
            await session.abortTransaction();
            return response.status(400).send({error: err.message});
        }finally{
            session.endSession();
        }
    }
);

router.put("/api/user/friends/solicitude/:friendId",
    isAuthtenticated,
    check('friendId')
      .isMongoId().withMessage('ID con formato invalido')
      .notEmpty().withMessage('El ID de usuario es requerido'),
    async (request, response) => {

        const result = validationResult(request);
        if (!result.isEmpty()) {
            return response.status(400).send({ error: result.array() });
        }
        const friendId = request.params.friendId;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const user = await User.findById(friendId);
            const { username } = user;
            if(!user){
                await session.abortTransaction();
                return response.status(400).send({error: "Falla al agregar amogus"});
            }
            const updatedRequestedList = await UserProfile.findOneAndUpdate(
              { userId:  friendId},
              { $addToSet: { requested: {userId: friendId, username} } },
              { new: true }
            );      

            if(!updatedRequestedList){
                await session.abortTransaction();
                return response.status(400).send({error: "Falla al agregar amogus"});
                
            }
            await session.commitTransaction();
            return response.status(200).send(userProfileDto(updatedRequestList));
            
        } catch (err) {
            await session.abortTransaction();
            return response.status(400).send({error: err.message});
        }finally{
            session.endSession();
        }
    }
);

router.put("/api/user/block/:otherUserId",
    isAuthtenticated,
    check("otherUserId")
      .isMongoId().withMessage("El nombre de usuario tiene que ser un string")
      .notEmpty().withMessage("el nombre de usuario no debe estar vacio"),
      async (request, response) =>{
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const otherUserId = request.params.otherUserId;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const findUserProfile = await User.findOne({userId: otherUserId});
            
            const updatedBlockedList = await UserProfile.findByIdAndUpdate(
                { userId: request.user.id },
                { $push: { blocked: {userId: findUserProfile.id, username: findUserProfile.username } } },
                { new: true }
              );

            if(!findUserProfile || !updatedBlockedList){
                await session.abortTransaction();
                return response.status(400).send({error: "No se puedo encontrar el perfil"});
            } 
            await session.commitTransaction();
            return response.status(200).send(otherUserProfileDto(findUserProfile));
        }catch (err) {
            await session.abortTransaction();
            return response.status(400).send({error: err.message});
        }finally{
            session.endSession();
        }   
    }
);

function userProfileDto(userProfile){
    const {
        userId,
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
        friends,
        requested
    } = userProfile;
    return {
        userId,
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
        friends,
        requested
    }
}

function otherUserProfileDto(userProfile){
    const {
        userId,
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
    } = userProfile;
    return {
        userId,
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
    }
}

export default router;