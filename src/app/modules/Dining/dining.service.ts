import slugify from "slugify";
import AppError from "../../errors/AppError";
import DiningModel from "./dining.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import ObjectId from "../../utils/ObjectId";
import { TDiningQuery } from "./dining.interface";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { DiningSearchFields } from "./dining.constant";
import TableModel from "../Table/table.model";



const createDiningService = async (loginUserId:string, name: string) => {
    const restaurant = await RestaurantModel.findOne({
        ownerId: loginUserId
    });
    if(!restaurant){
        throw new AppError(404, "You have no restaurant !");
    }

    const slug = slugify(name).toLowerCase();
    
    //check Dining is already existed
    const dining = await DiningModel.findOne({
        slug,
        ownerId: loginUserId,
        restaurantId: restaurant._id
    });
    if(dining){
        throw new AppError(409, 'This dining is already existed');
    }

    const result = await DiningModel.create({
         name,
         slug,
         ownerId: loginUserId,
         restaurantId: restaurant._id
    })
    return result;
}



const getDiningListService = async (loginUserId: string, query: TDiningQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, DiningSearchFields);
      }
    
      //5 setup filters
      let filterQuery = {};
      if (filters) {
        filterQuery = makeFilterQuery(filters);
      }
   const result = await DiningModel.aggregate([
      {
          $match: {
              ownerId: new ObjectId(loginUserId),
              ...searchQuery,
              ...filterQuery
          }
      },
      {
        $project: {
            _id:1,
            name:1
        }
      },
      { $sort: { [sortBy]: sortDirection } },
      { $skip: skip },
      { $limit: Number(limit) },
  ])

//total count
const totalDiningResult = await DiningModel.aggregate([
  {
    $match: {
      ownerId: new ObjectId(loginUserId),
      ...searchQuery,
      ...filterQuery
    }
  },
  { $count: "totalCount" }
])

const totalCount = totalDiningResult[0]?.totalCount || 0;
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

const getDiningDropDownService = async (loginUserId:string) => {
    const result = await DiningModel.find({
        ownerId: loginUserId
    }).select('-createdAt -updatedAt -slug -ownerId -restaurantId').sort('-createdAt');
    return result;
}



const updateDiningService = async (loginUserId:string, diningId: string, name: string) => {
    const restaurant = await RestaurantModel.findOne({
        ownerId: loginUserId
    });
    if(!restaurant){
        throw new AppError(404, "You have no restaurant !");
    }

    const dining = await DiningModel.findOne({
        ownerId: loginUserId,
        _id: diningId
    })
    if(!dining){
        throw new AppError(404, 'This diningId not found');
    }

    const slug = slugify(name).toLowerCase();
    const diningExist = await DiningModel.findOne({
         _id: { $ne: diningId },
         ownerId: loginUserId,
        slug 
    })
    if(diningExist){
        throw new AppError(409, 'Sorry! This dining name is already taken');
    }

    const result = await DiningModel.updateOne(
        { _id: diningId, ownerId:loginUserId},
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
        throw new AppError(404, 'This diningId not found');
    }

    //check if diningId is associated with table
    const associateWithTable = await TableModel.findOne({
         diningId
    });
    if(associateWithTable){
        throw new AppError(409, 'Failled to delete, This dining is associated with Table');
    }

     //check if diningId is associated with Booking Table
     const associateWithTableBooking = await TableModel.findOne({
        diningId
   });
   if(associateWithTableBooking){
       throw new AppError(409, 'Failled to delete, This dining is associated with Booking Table');
   }

    const result = await DiningModel.deleteOne({ _id: dining})
    return result;
}



export {
    createDiningService,
    getDiningListService,
    getDiningDropDownService,
    updateDiningService,
    deleteDiningService
}