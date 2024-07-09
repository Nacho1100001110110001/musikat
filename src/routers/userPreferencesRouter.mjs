import { response, Router } from "express";
import { isAuthtenticated } from "../utils/middlewares.mjs";
import { check, checkSchema, matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";
import { createCommentSchema, createPublicationSchema } from "../utils/validatorSchemas.mjs";
import { UserPreferences } from "../mongoose/schemas/userPreferencesSchema.mjs";

const router = Router();



//añadir atomicidad
router.put("/api/song/like/:songId",
    isAuthtenticated,
    check("songId")
      .isString().withMessage("El id tiene que ser un string")
      .notEmpty().withMessage("El id no debe estar vacio"),
    async (request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const data = matchedData(request);
        const userId = request.user.id;

        try {
            const liked = await UserPreferences.findOne({
                userId,
                likedSongs: data.songId
            });

            if(liked){
                const result = await UserPreferences.findOneAndUpdate(
                    { userId },
                    { $pull: { likedSongs: data.songId } },
                    {new: true}
                );
                if (result) {
                    console.log(result);
                    return response.status(200).send({
                        like: false,
                    });
                }
            }else{
                const result = await UserPreferences.findOneAndUpdate(
                    { userId },
                    { $addToSet: { likedSongs: data.songId } },
                    {new: true} 
                );
                if (result) {
                    console.log(result);
                    return response.status(200).send({
                        like: true
                    });
                }
            }
            
            return response.status(400).send({error: "No se pudo pipipi"});
            
        }catch(err){  
            return response.status(400).send({error: err.message});   
        }
    }
);

router.put("/api/artist/like/:artistId",
    isAuthtenticated,
    check("artistId")
      .isString().withMessage("El id tiene que ser un string")
      .notEmpty().withMessage("El id no debe estar vacio"),
    async (request, response) => {
        const restult = validationResult(request);
        if (!restult.isEmpty()) {
            return response.status(400).send({ error: restult.array() });
        }
        const data = matchedData(request);
        const userId = request.user.id;

        try {
            const liked = await UserPreferences.findOne({
                userId,
                likedArtists: data.artistId
            });

            if(liked){
                const result = await UserPreferences.findOneAndUpdate(
                    { userId },
                    { $pull: { likedArtists: data.artistId } },
                    {new: true}
                );
                if (result) {
                    console.log(result);
                    return response.status(200).send({
                        like: false,
                    });
                }
            }else{
                const result = await UserPreferences.findOneAndUpdate(
                    { userId },
                    { $addToSet: { likedArtists: data.artistId } },
                    {new: true} 
                );
                if (result) {
                    console.log(result);
                    return response.status(200).send({
                        like: true
                    });
                }
            }
            
            return response.status(400).send({error: "No se pudo pipipi"});
            
        }catch(err){  
            return response.status(400).send({error: err.message});   
        }
    }
);



router.get("/api/preferences",
    isAuthtenticated,
    async(request, response) => {
        const userId = request.user.id;
        try{
            const preferences = await UserPreferences.findOne({userId})
            .select("likedSongs likedArtists")
            .lean();
            if(!preferences){
                return response.status(400).send({error: "no se pudo encontrar la publicación"});
            }

            response.status(200).send(preferences);
        }catch(err){
            response.status(400).send({error: err.message});
        }
    }
    
)

export default router;