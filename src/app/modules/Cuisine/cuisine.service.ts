import slugify from "slugify";
import { ICuisine } from "./cuisine.interface";
import CuisineModel from "./cuisine.model";
import AppError from "../../errors/AppError";


const createCuisineService = async (payload: ICuisine) => {
    const slug = slugify(payload.name).toLowerCase();
    
    //check cuisine is already existed
    const cuisine = await CuisineModel.findOne({ slug });
    if(cuisine){
        throw new AppError(409, 'This quisine is already existed');
    }

    const result = await CuisineModel.create({
        name: payload.name,
        slug
    })

    return result;
}


const getCuisinesService = async () => {
    const result = await CuisineModel.find().select('-createdAt -updatedAt')
    return result;
}

export {
    createCuisineService,
    getCuisinesService
}