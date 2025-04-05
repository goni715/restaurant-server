import AppError from "../../errors/AppError";
import ObjectId from "../../utils/ObjectId";
import RestaurantModel from "../Restaurant/restaurant.model";
import ScheduleModel from "../Schedule/schedule.model";
import { ITable } from "./table.interface";
import TableModel from "./table.model";


const createTableService = async (loginUserId: string, payload: ITable) => {
    const { name, seats, diningId, scheduleId } = payload;
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
   

    //create the table 
    const result = await TableModel.create({
        scheduleId,
        ownerId:loginUserId,
        restaurantId: restaurant._id,
        diningId,
        name,
        seats
    })
    
    return result;
}


const getTablesService = async (loginUserId: string, scheduleId: string, diningId: string) => {
    //check schedule
    const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: scheduleId
    });


    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }

    const result = await TableModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId),
                scheduleId: new ObjectId(scheduleId),
                diningId: new ObjectId(diningId),
            }
        }
    ])

    return result;
}
export {
    createTableService,
    getTablesService
}