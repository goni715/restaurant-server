import { Types } from "mongoose";
import RestaurantModel from "../Restaurant/restaurant.model";
import AppError from "../../errors/AppError";
import FavouriteModel from "./favourite.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { FavouriteSearchFields } from "./favourite.constant";
import { TFavouriteQuery } from "./favourite.interface";


const addOrRemoveFavouriteService = async (
  loginUserId: string,
  restaurantId: string
) => {
  const ObjectId = Types.ObjectId;

  //check restaurant not exist
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  //cheack restaurant is already existed or not existed
  const favourite = await FavouriteModel.findOne({
    userId: loginUserId,
    restaurantId
  })

  
  let result;
  let message;

  //if exist, remove it
  if(favourite){
    result = await FavouriteModel.deleteOne({ _id: new ObjectId(favourite._id) })
    message = "Restaurant has been removed from your favorite list successfully."
  }


   //if not exist, create a new one
   if(!favourite){
    result = await FavouriteModel.create({
        userId: loginUserId,
        restaurantId
    })
    message = "Restaurant has been added to your favorite list successfully."
   }

   
   return {
      message,
      data: result
   }
 
};


const getFavouriteListService = async ( loginUserId: string, query:TFavouriteQuery ) => {
    const ObjectId = Types.ObjectId;
    
  // 1. Extract query parameters
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters // Any additional filters
  } = query;


  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery: any = {};
   if (searchTerm) {
     searchQuery = makeSearchQuery(searchTerm, FavouriteSearchFields);
     searchQuery = {
       $or: [
         ...searchQuery?.$or,
         { ["restaurant.keywords"]: { $in: [new RegExp(searchTerm, "i")] } },
       ],
     };
   }



  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  

    const result = await FavouriteModel.aggregate([
      {
        $match: { userId: new ObjectId(loginUserId) },
      },
      {
        $lookup: {
          from: "restaurants", 
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: "$restaurant"
      },
      {
        $match: { ...searchQuery, ...filterQuery }, // Apply search & filter queries
      },
      {
        $project: {
          _id: "$restaurant._id",
          name: "$restaurant.name",
          cuisine: "$restaurant.cuisine",
          dining: "$restaurant.dining",
          website: "$restaurant.website",
          location: "$restaurant.location",
          keywords: "$restaurant.keywords",
          price: "$restaurant.price",
          features: "$restaurant.features",
          discount: "$restaurant.discount",
          ratings: "$restaurant.ratings",
          restaurantImg: "$restaurant.restaurantImg",
          createdAt: "$createdAt",
        },
      },
      { $skip: skip }, 
      { $limit: Number(limit) }, 
      { $sort: { [sortBy]: sortDirection } }, 
    ]);


    //count total for pagination
    const totalResultCount = await FavouriteModel.aggregate([
      {
        $match: { userId: new ObjectId(loginUserId) },
      },
      {
        $lookup: {
          from: "restaurants", 
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: "$restaurant"
      },
      {
        $match: { ...searchQuery, ...filterQuery }, // Apply search & filter queries
      },
      { $count: "totalCount" },
    ]);


    const totalCount = totalResultCount[0]?.totalCount || 0;
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



export {
    addOrRemoveFavouriteService,
    getFavouriteListService
}