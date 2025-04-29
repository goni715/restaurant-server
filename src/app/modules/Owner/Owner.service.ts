/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import UserModel from '../User/user.model';
import { IUser, TUserQuery } from '../User/user.interface';
import config from '../../config';
import { UserSearchFields } from '../User/user.constant';
import RestaurantModel from '../Restaurant/restaurant.model';

const createOwnerService = async (payload: IUser) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (user) {
    throw new AppError(409, "Email is already existed");
  }

  if (!payload.password) {
    payload.password = config.owner_default_password as string;
  }

  const result = await UserModel.create({
    ...payload,
    role: "owner",
  });

  result.password = "";
  return result;
};


const getOwnersService = async (query: TUserQuery) => {
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
        role: "owner",
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
    role: "owner",
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


const updateOwnerService = async (ownerId: string, payload: Partial<IUser>) => {
  const owner = await UserModel.findById(ownerId);
  if(!owner){
    throw new AppError(404, "Owner Not Found");
  }
  const result = UserModel.updateOne(
    { _id: ownerId },
    payload
  )

  return result;
}

const deleteOwnerService = async (ownerId: string) => {
  const owner = await UserModel.findById(ownerId);
  if(!owner){
    throw new AppError(404, "Owner Not Found");
  }

  const restaurant = await RestaurantModel.findOne({
    ownerId
  });

  if(restaurant){
    throw new AppError(409, "Failled to delete, This Owner has aleady a restaurant!");
  }

  //delete the owner/user
  const result = await UserModel.deleteOne({
    _id: ownerId
  })

  return result;
}


export {
  createOwnerService,
  getOwnersService,
  updateOwnerService,
  deleteOwnerService
};
