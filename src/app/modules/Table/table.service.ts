import slugify from "slugify";
import AppError from "../../errors/AppError";
import ObjectId from "../../utils/ObjectId";
import RestaurantModel from "../Restaurant/restaurant.model";
import ScheduleModel from "../Schedule/schedule.model";
import { ITablePayload, IUpdateTablePayload, TTableQuery } from "./table.interface";
import TableModel from "./table.model";
import DiningModel from "../Dining/dining.model";
import TableBookingModel from "../TableBooking/tableBooking.model";


const createTableService = async (loginUserId: string, payload: ITablePayload) => {
    const { totalTable, seats, diningId, scheduleId } = payload;

    const restaurant = await RestaurantModel.findOne({
        ownerId: loginUserId,
    })
    if(!restaurant){
        throw new AppError(404, "Restaurant not found");
    }

    // //check schedule
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


    //find existing lastTableNumber
    const tables = await TableModel.aggregate([
      {
        $match: {
          ownerId: new ObjectId(loginUserId),
          scheduleId: new ObjectId(scheduleId),
          diningId: new ObjectId(diningId),
        },
      },
      // {
      //   $addFields: {
      //     nickName:"goni",
      //     SplitArray: {
      //       $split: ["$name", "-"] //name : "T-10" //output = ["T", "10"]
      //     },
      //     tableNumber: {
      //       $arrayElemAt: [
      //         { $split: ["$name", "-"]}, 1 //return string table Number = "10"
      //       ]
      //     },
      //     TwoInteger: {
      //       $toInt:  {
      //         $arrayElemAt: [
      //           { $split: ["$name", "-"]}, 1 //convertTo Integer = 10
      //         ]
      //       }
      //     }
      //   }
      // }
      {
        $addFields: {
          tableNumber: {
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
          tableNumber: -1 // sort descending to get highest number first
        }
      },
      {
        $limit: 1 // only return the last (highest numbered) table
      },
      {
        $project: {
          tableNumber:1
        }
      }
    ]);

    //lastTableNumber
    const lastTableNumber = tables?.length > 0 ? tables[0]?.tableNumber : 0;

    let tableData: any[] = [];
    for (let i = 1; i <= totalTable; i++) {
      const name = `T-${Number(lastTableNumber+i)}`;
      const slug = name.toLowerCase(); 
    
      tableData.push({
        name,
        slug,
        scheduleId,
        diningId,
        restaurantId: restaurant._id,
        ownerId:loginUserId,
        seats
      });
    }

    //create the tables
    const result = await TableModel.insertMany(tableData);
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
    // { 
    //   $group: {               //for single field 
    //     _id: "$scheduleId",
    //     count: { $count: {}},
    //     sum: { $sum: "$seats"},
    //     count2: { $sum: 1}
    //   },
    // },
    // {
    //   $group: {               //for multiple fields
    //     _id: {
    //       scheduleId: "$scheduleId",
    //       diningId: "$diningId",
    //     },
    //     count: { $count: {}},
    //     sum: { $sum: "$seats"},
    //     count2: { $sum: 1}
    //   },
    // },
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
        tableNumber: {
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
        tableNumber: 1
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