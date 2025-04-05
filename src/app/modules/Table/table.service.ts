import slugify from "slugify";
import AppError from "../../errors/AppError";
import ObjectId from "../../utils/ObjectId";
import RestaurantModel from "../Restaurant/restaurant.model";
import ScheduleModel from "../Schedule/schedule.model";
import { ITable, TTableQuery } from "./table.interface";
import TableModel from "./table.model";
import { makeSearchQuery } from "../../helper/QueryBuilder";
import { TableSearchFields } from "./table.constant";


const createTableService = async (loginUserId: string, payload: ITable) => {
    const { name, seats, diningId, scheduleId } = payload;
    const slug = slugify(name).toLowerCase();

    const restaurant = await RestaurantModel.findOne({
        ownerId: loginUserId,
    })
    if(!restaurant){
        throw new AppError(404, "Restaurant not found");
    }

    //check schedule
    const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: scheduleId
    });


    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }


    const dining = restaurant.dining;
    if(!dining.includes(new ObjectId(diningId))){
        throw new AppError(404, "This dining does not belong to your restaurant, please add this dining to your restaurant")
    }


    //check table is already existed
    const table = await TableModel.findOne({
        slug,
        scheduleId,
        ownerId:loginUserId,
        restaurantId: restaurant._id,
        diningId,
    });

    if(table){
        throw new AppError(409, "Table is already existed");
    }

    //create the table 
    const result = await TableModel.create({
        name,
        slug,
        scheduleId,
        ownerId:loginUserId,
        restaurantId: restaurant._id,
        diningId,
        seats
    })
    
    return result;
}


const getTablesService = async (loginUserId: string, scheduleId: string, diningId: string, query:TTableQuery) => {
    //check schedule
    const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: scheduleId
    });


    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }

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
          searchQuery = makeSearchQuery(searchTerm, TableSearchFields);
        }
      

    const result = await TableModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId),
                scheduleId: new ObjectId(scheduleId),
                diningId: new ObjectId(diningId),
            }
        },
        {
            $match: {
              ...searchQuery
            }
        },
        {
            $project: {
                _id:1,
                name:1,
                seats:1
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ])


    //total table count
    const totalTableResult = await TableModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId),
                scheduleId: new ObjectId(scheduleId),
                diningId: new ObjectId(diningId),
            }
        },
        {
            $match: {
              ...searchQuery
            }
        },
        { $count: "totalCount" }
    ]);

    
  const totalCount = totalTableResult[0]?.totalCount || 0;
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
    createTableService,
    getTablesService
}