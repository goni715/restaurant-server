import slugify from "slugify";
import AppError from "../../errors/AppError";
import ObjectId from "../../utils/ObjectId";
import RestaurantModel from "../Restaurant/restaurant.model";
import ScheduleModel from "../Schedule/schedule.model";
import { ITable, IUpdateTablePayload, TTableQuery } from "./table.interface";
import TableModel from "./table.model";
import DiningModel from "../Dining/dining.model";
import TableBookingModel from "../TableBooking/tableBooking.model";


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


const getTablesService = async (loginUserId: string,  query: TTableQuery) => {
  // 1. Extract query parameters
  const { page = 1, limit = 10, date } = query;

   // 2. Set up pagination
   const skip = (Number(page) - 1) * Number(limit);

  //4 setup filters
  let filterQuery = {};
  //check if only filter by date
  if (date) {
    const start = `${date}T00:00:00.000+00:00`;
    const end = `${date}T23:59:59.999+00:00`;
    filterQuery = {
      startDateTime: { $gte: new Date(start), $lte: new Date(end) },
    };
  }

  const result = await TableModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $group: {
        _id: {
          scheduleId: "$scheduleId",
          diningId: "$diningId",
        },
        totalSeats: { $sum: "$seats" },
        totalTables: { $sum: 1 },
      },
    },
    {
      $project: {
        _id:0,
        scheduleId: "$_id.scheduleId",
        diningId: "$_id.diningId",
        totalSeats:1,
        totalTables:1
      }
    },
    {
      $lookup: {
        from: "schedules",
        localField: "scheduleId",
        foreignField: "_id",
        as: "schedule"
      }
    },
    {
      $unwind: "$schedule"
    },
    {
      $lookup: {
        from: "dinings",
        localField: "diningId",
        foreignField: "_id",
        as: "dining"
      }
    },
    {
      $unwind: "$dining"
    },
    {
      $project: {
        scheduleId: "$scheduleId",
        diningId: "$diningId",
        totalSeats:1,
        totalTables:1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name"
      }
    },
    {
      $sort: {
        startDateTime:1,
        endDateTime:1
      }
    },
    {
      $match: {
        ...filterQuery
      }
    },
    { $skip: skip },
    { $limit: Number(limit) }
  ]);

  
  //count the total
  const totalTableResult = await TableModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $group: {
        _id: {
          scheduleId: "$scheduleId",
          diningId: "$diningId",
        },
        totalSeats: { $sum: "$seats" },
        totalTables: { $sum: 1 },
      },
    },
    {
      $project: {
        _id:0,
        scheduleId: "$_id.scheduleId",
        diningId: "$_id.diningId",
        totalSeats:1,
        totalTables:1
      }
    },
    {
      $lookup: {
        from: "schedules",
        localField: "scheduleId",
        foreignField: "_id",
        as: "schedule"
      }
    },
    {
      $unwind: "$schedule"
    },
    {
      $lookup: {
        from: "dinings",
        localField: "diningId",
        foreignField: "_id",
        as: "dining"
      }
    },
    {
      $unwind: "$dining"
    },
    {
      $project: {
        scheduleId: "$scheduleId",
        diningId: "$diningId",
        totalSeats:1,
        totalTables:1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name"
      }
    },
    {
      $match: {
        ...filterQuery
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
};


const getTablesByScheduleAndDiningService = async (loginUserId: string, scheduleId: string, diningId: string) => {
  //check schedule
  const schedule = await ScheduleModel.findOne({
    ownerId: loginUserId,
    _id: scheduleId,
  });

  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

  const dining = await DiningModel.findById(diningId);
  if (!dining) {
    throw new AppError(404, "dining not found");
  }

  //check dining
  const myDining = await RestaurantModel.findOne({
    dining: { $in: [diningId]}
  });

  if (!myDining) {
    throw new AppError(404, "This dining is not belong to my restaurant");
  }

  const result = await TableModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
        scheduleId: new ObjectId(scheduleId),
        diningId: new ObjectId(diningId),
      },
    },
    {
      $addFields: {
        nameNumber: {
          $toInt: {
            $arrayElemAt: [
              { $split: ["$name", "-"] },
              1
            ]
          }
        }
      }
    },
    {
      $sort: {
        nameNumber: 1
      }
    },
    {
      $project: {
        restaurantId:0,
        ownerId:0,
        createdAt:0,
        updatedAt:0,
        slug:0
      }
    }
  ]);


  return {
    diningName:dining?.name,
    startDateTime: schedule?.startDateTime,
    endDateTime: schedule?.endDateTime,
    tables:result
  };

}

const deleteTableService = async (loginUserId: string, tableId: string) => {
  const table = await TableModel.findOne({
    _id:tableId,
    ownerId: loginUserId
  })

  if(!table){
    throw new AppError(404, "Table Not Found");
  }
   //check if tableId is associated with tableBooking
   const associateWithTableBooking = await TableBookingModel.findOne({
     tableId
   });
   if(associateWithTableBooking){
       throw new AppError(409, 'Failled to delete, This Table is associated with Booking');
   }

   const result = await TableModel.deleteOne({ _id: tableId});
   return result;
}



const updateTableService = async (loginUserId: string, tableId: string, payload: Partial<IUpdateTablePayload>) => {
  const table = await TableModel.findOne({
    _id:tableId,
    ownerId: loginUserId
  })

  if(!table){
    throw new AppError(404, "Table Not Found");
  }

 
  //update the table name
  //check this table name is existing with other schedule & dining
  if(payload?.name){
    const slug = slugify(payload?.name).toLowerCase();
    payload.slug = slug;
    const tableExist = await TableModel.findOne({
      _id: { $ne: tableId },
      slug,
      scheduleId: table.scheduleId,
      diningId: table.diningId,
    });
    if (tableExist) {
      throw new AppError(409, "Sorry! This Table is already existed !");
    }
  }


  const result = await TableModel.updateOne(
    { _id: tableId },
    payload,
    { runValidators:true } //mongoose valid will be working, When you want to update
  );
  return result;
}

export {
    createTableService,
    getTablesService,
    getTablesByScheduleAndDiningService,
    updateTableService,
    deleteTableService
}