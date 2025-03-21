import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { IRestaurant, TApprovedStatus, TRestaurantQuery, TRestaurantStatus, TUserRestaurantQuery } from "./restaurant.interface";
import RestaurantModel from "./restaurant.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { RestaurantSearchFields } from "./restaurant.constant";
import { Request } from "express";



const createRestaurantService = async (
  req:Request,
  ownerId: string,
  payload: IRestaurant
) => {
  const { name } = payload;

  //check restaurant owner is already exist
  const owner = await RestaurantModel.findOne({ ownerId });
  if (owner) {
    throw new AppError(409, "Sorry! You have already a restaurant");
  }

  //check restaurant
  const restaurant = await RestaurantModel.findOne({ name });
  if (restaurant) {
    throw new AppError(409, "This restaurant name is already taken or existed");
  }

  
  if (req.file) {
    //for local machine file path
    payload.restaurantImg = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
  }


  //create the restaurant
  const result = await RestaurantModel.create({ ...payload, ownerId });
  return result;
};


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
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews"
      }
    },
    {
      $addFields: {
        totalReviewers: { $size: "$reviews" },
      }
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //     ownerId: 1,
    //     name: 1,
    //     cuisine: 1,
    //     dining: 1,
    //     website: 1,
    //     location: 1,
    //     keywords: 1,
    //     price: 1,
    //     features: 1,
    //     cancellationCharge:1,
    //     discount:1,
    //     ratings: 1,
    //     totalReviewers:1,
    //     status:1,
    //     approved:1,
    //     createdAt: 1,
    //     updatedAt: 1,
    //     ownerName: "$owner.fullName",
    //     ownerEmail: "$owner.email",
    //     ownerPhone: "$owner.phone",
    //     ownerImg: "$owner.profileImg",
    //     ownerAddress: "$owner.address"
    //   },
    // },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalRestaurantResult = await RestaurantModel.aggregate([
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
    { $count: "totalCount" },
  ]);


  const totalCount = totalRestaurantResult[0]?.totalCount || 0;
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
};

const getUserRestaurantsService = async (query: TUserRestaurantQuery) => {
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
      $match: {
        status: "active",
        approved: "accepted",
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
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
        dining: 1,
        website: 1,
        location: 1,
        keywords: 1,
        price: 1,
        features: 1,
        cancellationCharge: 1,
        discount: 1,
        ratings: 1,
        createdAt: 1,
        updatedAt: 1,
        ownerName: "$owner.fullName",
        ownerEmail: "$owner.email",
        ownerPhone: "$owner.phone",
        ownerImg: "$owner.profileImg",
        ownerAddress: "$owner.address",
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalRestaurantResult = await RestaurantModel.aggregate([
    {
      $match: {
        status: "active",
        approved: "accepted",
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $count: "totalCount" },
  ]);

    const totalCount = totalRestaurantResult[0]?.totalCount || 0;
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
};


const getOwnerRestaurantsService = async (loginUserId:string, query: TRestaurantQuery) => {
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
      $match: {
         ownerId: new ObjectId(loginUserId) ,
      }
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalRestaurantResult = await RestaurantModel.aggregate([
    {
      $match: {
         ownerId: new ObjectId(loginUserId) ,
      }
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = totalRestaurantResult[0]?.totalCount || 0;
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
};


const getSingleRestaurantService = async (restaurantId: string) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.aggregate([
    {
      $match: {
        _id: new ObjectId(restaurantId)
      }
    },
    {
      $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'owner' }
    },
    {
      $unwind: "$owner"
    },
    {
      $project: {
        _id: 1,
        ownerId: 1,
        name: 1,
        cuisine: 1,
        dining: 1,
        website: 1,
        location: 1,
        keywords: 1,
        price: 1,
        features: 1,
        cancellationCharge:1,
        discount:1,
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
  ])
  if(restaurant.length === 0){
    throw new AppError(404, "Restaurant Not Found");
  }

  return restaurant[0];
}
  

const changeRestaurantStatusService = async (restaurantId: string, status: TRestaurantStatus) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findById(restaurantId);
  if(!restaurant){
    throw new AppError(404, "Restaurant Not Found");
  }

  const result = await RestaurantModel.updateOne(
    { _id: new ObjectId(restaurantId) },
    { status }
  )

  return result;
}




const approveRestaurantService = async (restaurantId: string, approved: TApprovedStatus) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findById(restaurantId);
  if(!restaurant){
    throw new AppError(404, "Restaurant Not Found");
  }

  const result = await RestaurantModel.updateOne(
    { _id: new ObjectId(restaurantId) },
    { approved }
  )

  return result;
}


const updateRestaurantService = async (ownerId: string, restaurantId: string, payload: Partial<IRestaurant>) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findOne({
    _id: restaurantId,
    ownerId
  });

  if(!restaurant){
    throw new AppError(404, "Restaurant Not Found");
  }


  const result = await RestaurantModel.updateOne(
    { _id: new ObjectId(restaurantId), ownerId: new ObjectId(ownerId) },
    payload
  )
  

  return result;
}


export {
    createRestaurantService,
    getRestaurantsService,
    getUserRestaurantsService,
    getOwnerRestaurantsService,
    changeRestaurantStatusService,
    getSingleRestaurantService,
    approveRestaurantService,
    updateRestaurantService
}