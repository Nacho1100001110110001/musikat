import { Router, request, response } from "express";
import { isAuthtenticated } from "../utils/middlewares.mjs";
import { UserProfile } from "../mongoose/schemas/userProfileSchema.mjs";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { check, checkSchema, matchedData, validationResult } from "express-validator";
import { updateUserProfileSchema } from "../utils/validatorSchemas.mjs";
import mongoose from "mongoose";

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
            const findUser = await User.findOne({username: otherUserName});
            if(!findUser){
                return response.status(400).send({error: "No se puedo encontrar el usuario"});
            } 
            return response.status(200).send({userId: findUser.id, username: findUser.username});
        }catch (err) {
            return response.status(400).send({error: err.message});
        }
    }
)

router.get("/api/user/profile",
    isAuthtenticated,
    async (request, response) =>{
        console.log("pipipi")
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

        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const friendId = request.params.friendId;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const updatedFriendList = await UserProfile.findByIdAndUpdate(
              { userId: request.user.id },
              { $push: { friends: friendId } },
              { new: true }
            );
             
            const updatedRequestList = await UserProfile.findByIdAndUpdate(
                { userId: request.user.id },
                { $pull: { requested: friendId } },
                { new: true }
            );

            const newFriendProfile = await UserProfile.findByIdAndUpdate(
                { userId: friendId },
                { $push: { friends: request.user.id } },
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
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
        followed,
        friends,
        blocked,
        requested
    } = userProfile;
    return {
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
        followed,
        friends,
        blocked,
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
        followed
    } = userProfile;
    return {
        userId,
        username,
        birthDate,
        favoriteSong,
        favoriteArtist,
        favoriteGenre,
        followed
    }
}

export default router;