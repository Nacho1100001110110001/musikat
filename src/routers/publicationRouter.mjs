import { response, Router } from "express";
import { isAuthtenticated } from "../utils/middlewares.mjs";
import { check, checkSchema, matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";
import { createCommentSchema, createPublicationSchema } from "../utils/validatorSchemas.mjs";
import { Publication } from "../mongoose/schemas/publicationSchema.mjs";

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

            console.log(data);
            const publication = new Publication(data);
            const newPublication = await publication.save();

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
            const publicacion = await Publication.findById(data.id);
            if(!publicacion){
                return response.status(400).send({error: "no se pudo encontrar la publicación"});
            }
            response.status(200).send(publicacion);
        }catch(err){
            response.status(400).send({error: err.message});
        }
    }
    
)

export default router;

