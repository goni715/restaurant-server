import slugify from "slugify";
import AppError from "../../errors/AppError";
import DiningModel from "./dining.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { Types } from "mongoose";


const createDiningService = async (name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check Dining is already existed
    const dining = await DiningModel.findOne({ slug });
    if(dining){
        throw new AppError(409, 'This dining is already existed');
    }

    const result = await DiningModel.create({ name, slug })
    return result;
}


const getDiningListService = async () => {
    const result = await DiningModel.find().select('-createdAt -updatedAt').sort('-createdAt')
    return result;
}

const updateDiningService = async (diningId: string, name: string) => {
    const dining = await DiningModel.findById(diningId)
    if(!dining){
        throw new AppError(404, 'This dining not found');
    }

    const slug = slugify(name).toLowerCase();
    const diningExist = await DiningModel.findOne({ _id: { $ne: diningId }, slug })
    if(diningExist){
        throw new AppError(409, 'Sorry! This dining name is already taken');
    }

    const result = await DiningModel.updateOne(
        { _id: diningId},
        {
            name,
            slug
        }
    )

    return result;
}

const deleteDiningService = async (diningId: string) => {
    const dining = await DiningModel.findById(diningId)
    if(!dining){
        throw new AppError(404, 'This dining not found');
    }

    //check if diningId is associated with restaurant
    const associateWithRestaurant = await RestaurantModel.findOne({ dining: { $in: [diningId] } });
    if(associateWithRestaurant){
        throw new AppError(400, 'Failled to delete, This dining is associated with restaurant');
    }

    const result = await DiningModel.deleteOne({ _id: dining})
    return result;
}

export {
    createDiningService,
    getDiningListService,
    updateDiningService,
    deleteDiningService
}