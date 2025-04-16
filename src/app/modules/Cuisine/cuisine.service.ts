import slugify from "slugify";
import CuisineModel from "./cuisine.model";
import AppError from "../../errors/AppError";
import { Request } from "express";
import MenuModel from "../Menu/menu.model";


const createCuisineService = async (req:Request, name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check cuisine is already existed
    const cuisine = await CuisineModel.findOne({ slug });
    if(cuisine){
        throw new AppError(409, 'This cuisine is already existed');
    }

    // if(!req.file){
    //     throw new AppError(400, "image is required");
    // }
    let image="";
    if(req.file) {
        //for local machine file path
        image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
    }

    const result = await CuisineModel.create({
        name,
        image,
        slug
    })

    return result;
}


const getCuisinesService = async () => {
    const result = await CuisineModel.find().select('-slug -createdAt -updatedAt').sort('-createdAt')
    return result;
}

const updateCuisineService = async (req:Request, cuisineId: string, name: string) => {
    const cuisine = await CuisineModel.findById(cuisineId)
    if(!cuisine){
        throw new AppError(404, 'This quisine not found');
    }

    const slug = slugify(name).toLowerCase();
    const cuisineExist = await CuisineModel.findOne({ _id: { $ne: cuisineId }, slug })
    if(cuisineExist){
        throw new AppError(409, 'Sorry! This quisine name is already taken');
    }

    let image=cuisine.image;
    if(req.file) {
        //for local machine file path
        image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
    }

    const result = await CuisineModel.updateOne(
        { _id: cuisineId},
        {
            name,
            image,
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

    //check if cuisineId is associated with menu
    const associateWithMenu = await MenuModel.findOne({ cuisineId });
    if(associateWithMenu){
        throw new AppError(409, 'Failled to delete, This cusine is associated with menu');
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