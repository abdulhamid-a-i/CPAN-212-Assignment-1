import { AppError } from "../utils/apperror.js";
export async function authRequest(req, res, next){

    const apiKey = req.headers['x-api-key'];
    
    if(apiKey !== process.env.API_KEY){
        return next(
            new AppError(401,"UNAUTHORIZED", "Unauthorized Request")
        );
    }
    next();

};