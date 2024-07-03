export const isAuthtenticated = (request, response, next) => {
	if(!request.user){
        return response.sendStatus(401);
    }
	next();
};
export const authenticationErrorHandler = (err, req, res, next) => {
    if (err) {  
        return res.status(401).json({ message: err.message }); 
    }
    next();
};