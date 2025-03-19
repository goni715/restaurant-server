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

const updateCuisineService = async (cuisineId: string, payload: ICuisine) => {
    const cuisine = await CuisineModel.findById(cuisineId)
    if(!cuisine){
        throw new AppError(404, 'This quisine not found');
    }

    const slug = slugify(payload.name).toLowerCase();
    const cuisineExist = await CuisineModel.findOne({ _id: { $ne: cuisineId }, slug })
    if(cuisineExist){
        throw new AppError(409, 'Sorry! This quisine name is already taken');
    }

    const result = await CuisineModel.updateOne(
        { _id: cuisineId},
        {
            name: payload.name,
            slug
        }
    )

    return result;
}

const deleteCuisineService = async (cuisineId: string) => {
    const cuisine = await CuisineModel.findById(cuisineId)
    if(!cuisine){
        throw new AppError(404, 'This quisine not found');
    }

    const result = await CuisineModel.deleteOne({ _id: cuisineId})

    return result;
}

export {
    createCuisineService,
    getCuisinesService,
    updateCuisineService,
    deleteCuisineService
}