import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import UserModel from "../User/user.model";
import { IRestaurantPayload, TRestaurantQuery } from "./restaurant.interface";
import RestaurantModel from "./restaurant.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { RestaurantSearchFields } from "./restaurant.constant";
import { features } from "process";



const createRestaurantService = async (payload: IRestaurantPayload) => {
    const { ownerData, restaurantData } = payload;

    
  //check email already existed
  const emailExists = await UserModel.findOne({ email: ownerData.email });
  if (emailExists) {
    throw new AppError(409, 'This email is already existed');
  }

  //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ name: restaurantData.name});
  if (restaurant) {
    throw new AppError(409, 'This restaurant name is already taken or existed');
  }


  const session = await mongoose.startSession();

    try{
        session.startTransaction();

        //create the user
        const user = await UserModel.create(
            [{ ...ownerData, role: "admin" }],
            { session }
        );


        //create the restaurant
        const newRestaurant = await RestaurantModel.create(
            [{ ...restaurantData,ownerId: user[0]._id }],
            { session }
        )
        await session.commitTransaction();
        await session.endSession();
        return newRestaurant[0]
    }catch(err:any){
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err)
    }
    
}


const getRestaurantsService = async (query: TRestaurantQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, RestaurantSearchFields);
    searchQuery = {
      $or: [
        ...searchQuery?.$or,
        { keywords: { $in: [new RegExp(searchTerm, "i")] } }
      ]
    }
  }

  //console.dir(searchQuery, {depth:null})

  //5 setup filters

  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  const result = await RestaurantModel.aggregate([
    {
      $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'owner' }
    },
    {
      $unwind: "$owner"
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $project: {
        _id: 1,
        ownerId: 1,
        name: 1,
        cuisine: 1,
        website: 1,
        location: 1,
        keywords: 1,
        price: 1,
        features: 1,
        cancellationCharge:1,
        discount:1,
        availability:1,
        status:1,
        createdAt: 1,
        updatedAt: 1,
        ownerName: "$owner.fullName",
        ownerEmail: "$owner.email",
        ownerPhone: "$owner.phone",
        ownerImg: "$owner.profileImg",
        ownerAddress: "$owner.address"
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalCount = await RestaurantModel.countDocuments({
    ...searchQuery,
    ...filterQuery,
  });

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)),
      total: totalCount,
    },
    data: result,
  };
};
  

export {
    createRestaurantService,
    getRestaurantsService
}