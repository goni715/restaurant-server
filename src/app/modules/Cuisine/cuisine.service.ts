import slugify from "slugify";
import CuisineModel from "./cuisine.model";
import AppError from "../../errors/AppError";
import { Request } from "express";
import MenuModel from "../Menu/menu.model";
import { TCuisineQuery } from "./cuisine.interface";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { CuisineSearchFields } from "./cuisine.constant";


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


const getCuisinesService = async (query: TCuisineQuery) => {
      // 1. Extract query parameters
        const {
          searchTerm, 
          page = 1, 
          limit = 10, 
          sortOrder = "desc",
          sortBy = "createdAt", 
          ...filters  // Any additional filters
        } = query;
      
        // 2. Set up pagination
        const skip = (Number(page) - 1) * Number(limit);
      
        //3. setup sorting
        const sortDirection = sortOrder === "asc" ? 1 : -1;
      
        //4. setup searching
        let searchQuery = {};
        if (searchTerm) {
          searchQuery = makeSearchQuery(searchTerm, CuisineSearchFields);
        }
      
        //5 setup filters
        let filterQuery = {};
        if (filters) {
          filterQuery = makeFilterQuery(filters);
        }
    const result = await CuisineModel.aggregate([
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ])

  //total count
  const totalCuisineResult = await CuisineModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCuisineResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
}

const getCuisineDropDownService = async () => {
  const result = await CuisineModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
  return result;
}

const updateCuisineService = async (req:Request, cuisineId: string, name: string) => {
    const cuisine = await CuisineModel.findById(cuisineId)
    if(!cuisine){
        throw new AppError(404, 'This cuisine not found');
    }

    const slug = slugify(name).toLowerCase();
    const cuisineExist = await CuisineModel.findOne({ _id: { $ne: cuisineId }, slug })
    if(cuisineExist){
        throw new AppError(409, 'Sorry! This cuisine is already taken');
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
    getCuisineDropDownService,
    updateCuisineService,
    deleteCuisineService
}