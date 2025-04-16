import UserModel from "./user.model";
import { IUser, TUserQuery } from "./user.interface";
import AppError from "../../errors/AppError";
import { Request } from "express";
import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { UserSearchFields } from "./user.constant";
import ObjectId from "../../utils/ObjectId";



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



const getMeForSuperAdminService = async (userId: string) => {
  const result = await UserModel.aggregate([
    {
      $match: {
        _id: new ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "administrators",
        localField: "_id",
        foreignField: "userId",
        as: "administrator"
      }
    },
  ])
  
  const returnData = {
    fullName: result[0]?.fullName,
    email: result[0]?.email,
    phone: result[0]?.phone,
    role: result[0]?.role,
    profileImg: result[0]?.profileImg,
    access: result[0]?.administrator?.length > 0 ? result[0]?.administrator[0]?.access : ["user", "dashboard", "restaurant", "settings"]
  }
  return returnData;
}


const getMeService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if(!user){
    throw new AppError(404, "No User Found");
  }
  return user;
}

const editMyProfileService = async (req:Request, loginUserId: string, payload: Partial<IUser>) => {
  //upload the image
  if(req.file) {
    //for local machine file path
    payload.profileImg = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
  }

  const result = UserModel.updateOne(
    { _id: loginUserId },
    payload
  )

  return result;
}


const updateProfileImgService = async (req:Request, loginUserId: string) => {

  if(!req.file){
    throw new AppError(400, "image is required");
  }

  //uploaded-image
  const image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
  
  const result = await UserModel.updateOne(
    { _id: loginUserId },
    { profileImg : image }
  )

  return result;

};


export { createUserService, getUsersService, getSingleUserService, getMeForSuperAdminService, getMeService, editMyProfileService, updateProfileImgService };
