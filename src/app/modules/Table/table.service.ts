import AppError from "../../errors/AppError";
import ScheduleModel from "../Schedule/schedule.model";
import { ITable } from "./table.interface";


const createTableService = async (loginUserId: string, payload: ITable) => {
    const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: payload.scheduleId
    });

    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }
    
    return payload;
}

export {
    createTableService
}