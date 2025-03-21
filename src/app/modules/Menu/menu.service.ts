import slugify from "slugify";
import AppError from "../../errors/AppError";
import CuisineModel from "../Cuisine/cuisine.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IMenu, TMenuQuery } from "./menu.interface"
import MenuModel from "./menu.model";
import { Request } from "express";
import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { MenuSearchFields } from "./menu.constant";



const createMenuService = async (req:Request, loginUserId: string, payload: IMenu) => {
    const { cuisineId, name } = payload;
    const slug = slugify(name).toLowerCase();

    //check cuisine not found
    const cuisine = await CuisineModel.findById(cuisineId);
    if (!cuisine) {
      throw new AppError(404, "This cuisine not found");
    }

    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
      ownerId: loginUserId
    });
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found");
    }


    //check menu already existed
    const menu = await MenuModel.findOne({
      ownerId: loginUserId,
      restaurantId: restaurant._id,
      cuisineId,
      slug
    });

    if(menu) {
      throw new AppError(409, "Menu is already existed");
    }

    
    
    if (!req.file) {
      throw new AppError(400, "image is required");
    }
    let image="";
    if (req.file) {
      //for local machine file path
      image = `${req.protocol}://${req.get("host")}/uploads/${ req.file.filename}`; //for local machine
    }

    //create the menu
    const result = await MenuModel.create({
        ...payload,
        ownerId: loginUserId,
        restaurantId: restaurant._id,
        image,
        slug
    })
    
    return result;
}


const getMenusService = async (restaurantId:string, query: TMenuQuery) => {
  const ObjectId = Types.ObjectId;
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
      searchQuery = makeSearchQuery(searchTerm, MenuSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }

  const result = await MenuModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId)}
    },
    {
      $lookup: {
        from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
      }
    },
    {
      $unwind: "$cuisine"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image:1,
        price:1,
        ingredient:1,
        ratings:1,
        cuisineId:1,
        cuisineName: "$cuisine.name",
        createdAt: "$createdAt"
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])


  const totalMenuResult = await MenuModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId)}
    },
    {
      $lookup: {
        from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
      }
    },
    {
      $unwind: "$cuisine"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalMenuResult[0]?.totalCount || 0;
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


const updateMenuService = async (req:Request, loginUserId: string, menuId:string, payload: IMenu) => {
  const { cuisineId, name } = payload;
 

  //check cuisine not found
  const cuisine = await CuisineModel.findById(cuisineId);
  if (!cuisine) {
    throw new AppError(404, "This cuisine not found");
  }

 

  //check menu not found
  const menu = await MenuModel.findOne({
    _id: menuId,
    ownerId: loginUserId,
  });

  if (!menu) {
    throw new AppError(404, "Menu not found");
  }

  let slug = menu.slug;
  if(name){
    slug = slugify(name).toLowerCase();
  }
  
  let image=cuisine.image;
  if(req.file) {
      //for local machine file path
      image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
  }


  //update the menu
  const result = await MenuModel.updateOne(
    {
      _id: menuId,
      ownerId: loginUserId
    },
    {
      ...payload,
      image,
      slug
  })
  
  return result;
}


const deleteMenuService = async (loginUserId: string, menuId: string) => {
   //check menu not found
   const menu = await MenuModel.findOne({
    _id: menuId,
    ownerId: loginUserId,
  });

  if (!menu) {
    throw new AppError(404, "Menu not found");
  }

  const result = await MenuModel.deleteOne({
    _id: menuId,
    ownerId: loginUserId
  },)
  return result;
}


export {
    createMenuService,
    getMenusService,
    updateMenuService,
    deleteMenuService
}