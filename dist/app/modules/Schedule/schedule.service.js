"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScheduleService = exports.getSingleScheduleService = exports.getUserSchedulesService = exports.getScheduleDropDownService = exports.getSchedulesService = exports.createScheduleService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const schedule_model_1 = __importDefault(require("./schedule.model"));
const booking_model_1 = __importDefault(require("../Booking/booking.model"));
const table_model_1 = __importDefault(require("../Table/table.model"));
const createScheduleService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, slot, availableSeats, bookingFee, availability, paymentRequired } = payload;
    //check restaurant not found
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    // schedule creation part
    const schedules = [];
    //duration = const timeSlotMinutes = 30; // Schedule interval = unit = minutes
    // Convert start and end date to UTC
    const startDateObj = new Date(`${startDate}T00:00:00.000Z`);
    const endDateObj = new Date(`${endDate}T00:00:00.000Z`);
    for (let currentDate = new Date(startDateObj); currentDate <= endDateObj; currentDate.setUTCDate(currentDate.getUTCDate() + 1)) {
        let currentDay = new Date(currentDate);
        for (let i = 0; i < slot.length; i++) {
            const { startTime, endTime } = slot[i];
            const [startHour, startMinute] = startTime.split(":").map(Number);
            let startDateTime = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), startHour, startMinute, 0));
            const [endHour, endMinute] = endTime.split(":").map(Number);
            let endDateTime = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), endHour, endMinute, 0));
            const scheduleData = {
                ownerId: loginUserId,
                restaurantId: restaurant._id,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
            };
            //check if schedule exist
            const existingSchedule = yield schedule_model_1.default.findOne(scheduleData);
            if (!existingSchedule) {
                schedules.push(Object.assign(Object.assign({}, scheduleData), { availableSeats,
                    bookingFee,
                    availability,
                    paymentRequired }));
            }
        }
    }
    const result = yield schedule_model_1.default.insertMany(schedules);
    return result;
});
exports.createScheduleService = createScheduleService;
const getSchedulesService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { page = 1, limit = 10, sortOrder = "asc", sortBy = "startDateTime", date, startDate, endDate
    //...filters // Any additional filters
     } = query;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4 setup filters
    let filterQuery = {};
    //check if only filter by date
    if (date && !startDate && !endDate) {
        const start = `${date}T00:00:00.000+00:00`;
        const end = `${date}T23:59:59.999+00:00`;
        filterQuery = {
            startDateTime: { $gte: new Date(start), $lte: new Date(end) },
        };
    }
    //check if startDate & endDate exist
    if (startDate && endDate) {
        const start = `${startDate}T00:00:00.000+00:00`;
        const end = `${endDate}T23:59:59.999+00:00`;
        filterQuery = {
            startDateTime: { $gte: new Date(start) },
            endDateTime: { $lte: new Date(end) },
        };
    }
    //check restaurant not found
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId,
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    const result = yield schedule_model_1.default.aggregate([
        {
            $match: Object.assign({ restaurantId: new ObjectId(restaurant._id) }, filterQuery)
        },
        { $sort: { startDateTime: -1, endDateTime: -1 } },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    // total count of matching users 
    const totalReviewResult = yield schedule_model_1.default.aggregate([
        {
            $match: Object.assign({ restaurantId: new ObjectId(restaurant._id) }, filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalReviewResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
});
exports.getSchedulesService = getSchedulesService;
const getScheduleDropDownService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { date } = query;
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
    //check restaurant not found
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId,
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    const result = yield schedule_model_1.default.aggregate([
        {
            $match: Object.assign({ restaurantId: new ObjectId(restaurant._id) }, filterQuery),
        },
        {
            $project: {
                _id: 1,
                startDateTime: 1,
                endDateTime: 1
            }
        },
        { $sort: { startDateTime: 1, endDateTime: 1 } },
    ]);
    return result;
});
exports.getScheduleDropDownService = getScheduleDropDownService;
const getUserSchedulesService = (restaurantId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { page = 1, limit = 10, sortOrder = "asc", sortBy = "startDateTime", date
    //...filters // Any additional filters
     } = query;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4 setup filters
    let filterQuery = {};
    //check if only filter by date
    if (date) {
        const start = `${date}T00:00:00.000+00:00`;
        const end = `${date}T23:59:59.999+00:00`;
        filterQuery = {
            startDateTime: { $gte: new Date(start), $lte: new Date(end) }
        };
    }
    //check restaurant not found
    const restaurant = yield restaurant_model_1.default.findOne({
        _id: restaurantId,
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    const result = yield schedule_model_1.default.aggregate([
        {
            $match: Object.assign({ restaurantId: new ObjectId(restaurant._id) }, filterQuery)
        },
        { $sort: { [sortBy]: sortDirection, endDateTime: 1 } },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    // total count of matching users 
    const totalReviewResult = yield schedule_model_1.default.aggregate([
        {
            $match: Object.assign({ restaurantId: new ObjectId(restaurant._id) }, filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalReviewResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
});
exports.getUserSchedulesService = getUserSchedulesService;
const getSingleScheduleService = (scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield schedule_model_1.default.findById(scheduleId);
    if (!schedule) {
        throw new AppError_1.default(404, "Schedule not found");
    }
    return schedule;
});
exports.getSingleScheduleService = getSingleScheduleService;
const deleteScheduleService = (loginUserId, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    //check schedule not found
    const schedule = yield schedule_model_1.default.findOne({ _id: scheduleId, ownerId: loginUserId });
    if (!schedule) {
        throw new AppError_1.default(404, "Schedule not found");
    }
    //check if scheduleId is associated with booking
    const associateWithBooking = yield booking_model_1.default.findOne({ scheduleId });
    if (associateWithBooking) {
        throw new AppError_1.default(409, 'Failled to delete, This Schedule is associated with booking');
    }
    //check if scheduleId is associated with table
    const associateWithTable = yield table_model_1.default.findOne({ scheduleId });
    if (associateWithTable) {
        throw new AppError_1.default(409, 'Failled to delete, This Schedule is associated with Table');
    }
    const result = yield schedule_model_1.default.deleteOne({
        _id: scheduleId,
        ownerId: loginUserId
    });
    return result;
});
exports.deleteScheduleService = deleteScheduleService;
