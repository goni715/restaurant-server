import UserModel from "./user.model";
import { IUser, TUserQuery } from "./user.interface";
import AppError from "../../errors/AppError";
import { Request } from "express";
import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { UserSearchFields } from "./user.constant";



const createUserService = async (req:Request, payload: IUser) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (user) {
      throw new AppError(409, 'Email is already existed')
  }
        

  if (req.file) {
     //for local machine file path
     payload.profileImg = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
  }


  const result = await UserModel.create({
    ...payload,
    role: "user"
  });

  result.password=""
  return result;
}




const getUsersService = async (query: TUserQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, UserSearchFields);
  }

  //5 setup filters

  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }


  const result = await UserModel.aggregate([
    {
      $match: {
        role: "user",
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender:1,
        role: 1,
        status: 1,
        profileImg: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count of matching users
  const totalCount = await UserModel.countDocuments({
    role: "user",
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
}


const getSingleUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select('-role -status -address');
  if(!user){
    throw new AppError(404, "No User Found");
  }
  return user;
}



const getMeService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if(!user){
    throw new AppError(404, "No User Found");
  }
  return user;
}



export { createUserService, getUsersService, getSingleUserService, getMeService };
