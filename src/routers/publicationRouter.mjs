import { response, Router } from "express";
import { isAuthtenticated } from "../utils/middlewares.mjs";
import { check, checkSchema, matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";
import { createCommentSchema, createPublicationSchema } from "../utils/validatorSchemas.mjs";
import { Publication } from "../mongoose/schemas/publicationSchema.mjs";
import { UserProfile } from "../mongoose/schemas/userProfileSchema.mjs";
import { UserPreferences } from "../mongoose/schemas/userPreferencesSchema.mjs";

const router = Router();

router.post("/api/pub",
    isAuthtenticated,
    checkSchema(createPublicationSchema),
    async (request, response) => {
        const result = validationResult(request);
        if(!result.isEmpty()){
            return response.status(400).send({error: result.array()});
        }
        try {
            const data = matchedData(request);

            data.username = request.user.username;
            data.userId = request.user.id;
            data.publicationDate = Date.now();

            const publication = new Publication(data);
            const newPublication = await publication.save().lean();

            delete newPublication.likes;
            newPublication.hasLiked = false;

            if(!newPublication) throw new Error("No se encontrar el perfil");
            response.status(200).send(newPublication);
        } catch (err) {
            response.status(400).send({error: err.message});
        }
    }
);

router.delete("/api/pub/:id",
    isAuthtenticated,
    check("id")
      .isString().withMessage("El id tiene que ser un string")
      .notEmpty().withMessage("El id no debe estar vacio"),
    async (request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const publicationId = request.params.id;
        try {
            const result = Publication.findByIdAndDelete({_id: publicationId, userId: request.user.id});
            if(!result){
                return response.status(400).send({error: "No se puedo encontrar la publicación"});
            }
            return response.status(200).send({deleted: true}); 
        }catch(err){
            return response.status(400).send({error: err.message});
        }
    }
);

//añadir atomicidad
router.put("/api/pub/like/:id",
    isAuthtenticated,
    check("id")
      .isString().withMessage("El id tiene que ser un string")
      .notEmpty().withMessage("El id no debe estar vacio"),
    async (request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const publicationId = request.params.id;

        try {
            const liked = await Publication.findOne({
                _id: publicationId,
                likes: request.user.id
            });

            if(liked){
                const result = await Publication.findOneAndUpdate(
                    { _id: publicationId },
                    { $pull: { likes: request.user.id } , $inc: { likeCount: -1 } },
                    {new: true}
                ).select("likeCount");
                if (result) {
                    console.log(result);
                    return response.status(200).send({
                        like: false,
                        likeCount: result.likeCount
                    });
                }
            }else{
                const result = await Publication.findOneAndUpdate(
                    { _id: publicationId },
                    { $addToSet: { likes: request.user.id } , $inc: { likeCount: 1 } },
                    {new: true} 
                ).select("likeCount");
                if (result) {
                    console.log(result);
                    return response.status(200).send({
                        like: true,
                        likeCount: result.likeCount
                    });
                }
            }
            
            return response.status(400).send({error: "No se pudo pipipi"});
            
        }catch(err){  
            return response.status(400).send({error: err.message});   
        }
    }
);

router.post("/api/pub/comment/:id",
    isAuthtenticated,
    check("id")
      .isString().withMessage("El id tiene que ser un string")
      .notEmpty().withMessage("El id no debe estar vacio"),
    checkSchema(createCommentSchema),
    async (request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        try {
            const data = matchedData(request);
            const newComment = await Publication.findOneAndUpdate(
                { _id: data.id}, 
                {$push : {comments : {
                    userId: request.user.id,
                    username: request.user.username,
                    comment: data.comment
                }}}, 
                {new: true}
            );
            if(!newComment) {
                return response.status(400).send({error: "no se pudo enviar el comentario"});
            }
            response.status(200).send(newComment.comments);
        } catch (err) {
            response.status(400).send({error: err.message});
        }
    }
);

router.get("/api/pub/:id",
    isAuthtenticated,
    check("id")
      .isString().withMessage("El id tiene que ser un string")
      .notEmpty().withMessage("El id no debe estar vacio"),
    async(request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        try{
            const data = matchedData(request);
            const publicacion = await Publication.findById(data.id).lean();
            if(!publicacion){
                return response.status(400).send({error: "no se pudo encontrar la publicación"});
            }
            console.log(request.user.id);
            const hasLiked = publicacion.likes.some(like => {
                return like.toString() == request.user.id;
            });
            delete publicacion.likes;
            publicacion.hasLiked = hasLiked;
            response.status(200).send(publicacion);
        }catch(err){
            response.status(400).send({error: err.message});
        }
    }
    
)

router.get("/api/user/pub/:userId",
    isAuthtenticated,
    check("userId")
      .isMongoId().withMessage("El id tiene formato incorrecto")
      .notEmpty().withMessage("El id no debe estar vacio"),
    async(request, response) => {
        try{
            const userId = request.user.id;
            const publications = await Publication.find({ userId })
            .lean();
            if(!publications){
                return response.status(400).send({error: "no se pudo encontrar la publicación"});
            }

            publications.map(publication => {
                const hasLiked = publication.likes.some(like => {
                    return like.toString() == request.user.id;
                }); 
                delete publication.likes;
                publication.hasLiked = hasLiked;
                return publication;
            })
            delete publications.likes;
            publications.hasLiked = hasLiked;
            response.status(200).send(publications);
        }catch(err){
            response.status(400).send({error: err.message});
        }
    }
    
)

//mejoras:
//paginacion y atomicidad
router.get("/api/feed",
    isAuthtenticated,
    async(request, response) => {
        const userId = request.user.id;
        try{
            const userFriends = await UserProfile.findOne({userId})
                .select("friends")
                .lean();
            console.log(userFriends);
            if(!userFriends) throw Error("no se encontraron amigos");

            const userPrefences = await UserPreferences.findOne({userId})
                .lean();
            console.log(userPrefences)
            if(!userPrefences) throw Error("No se encontraron preferencias");

            const userFriendsId = userFriends.friends.map(friends => friends.userId);
            const LikedSongsId = userPrefences.likedSongs;
            const LikedArtistsId = userPrefences.likedArtists;
    
            const publications = await Publication.find({
                $or: [
                    { userId: { $in: userFriendsId } },
                    { artistId: { $in: LikedArtistsId } },
                    { songId: { $in: LikedSongsId } }
                ]
            })
            .sort({ publicationDate: -1 })
            .lean();

            if(!publications){
                return response.status(400).send({error: "no se pudo encontrar la publicación"});
            }

            const feed = publications.map(publication =>{

                const mapPub = {
                    ...publication,
                    liked: publication.likes.includes(new mongoose.Types.ObjectId(userId + ""))
                }

                delete mapPub.likes;
                return mapPub;
            })

            response.status(200).send({feed});
        }catch(err){
            response.status(400).send({error: err.message});
        }
    }
    
)

export default router;

