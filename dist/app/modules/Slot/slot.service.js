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
exports.deleteSlotService = exports.getSlotDropDownService = exports.getSlotsService = exports.createSlotService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const slot_model_1 = __importDefault(require("./slot.model"));
const createSlotService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check restaurant not found
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    //destructuring the payload
    const { startTime, endTime } = payload;
    const slot = yield slot_model_1.default.findOne({
        restaurantId: restaurant._id,
        ownerId: loginUserId,
        startTime,
        endTime
    });
    if (slot) {
        throw new AppError_1.default(409, "This slot is already existed");
    }
    const currentDay = new Date("2025-01-01T00:00:00.000Z");
    // Parse start and end time as UTC
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startDateTime = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), startHour, startMinute, 0)); //month is 0-based
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const endDateTime = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), endHour, endMinute, 0)); //month is 0-based
    const result = yield slot_model_1.default.create({
        restaurantId: restaurant._id,
        ownerId: loginUserId,
        startTime,
        endTime,
        startDateTime,
        endDateTime
    });
    return result;
});
exports.createSlotService = createSlotService;
const getSlotsService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { page = 1, limit = 10, } = query;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    const result = yield slot_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        {
            $sort: { startDateTime: 1, endDateTime: 1 }
        },
        {
            $project: {
                startDateTime: 1,
                endDateTime: 1,
                startTime: 1,
                endTime: 1
            }
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    //count the total slot
    const totalSlotResult = yield slot_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        {
            $sort: { startDateTime: 1, endDateTime: 1 }
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalSlotResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getSlotsService = getSlotsService;
const getSlotDropDownService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const result = yield slot_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        {
            $project: {
                startDateTime: 1,
                endDateTime: 1,
                startTime: 1,
                endTime: 1
            }
        },
        {
            $sort: { startDateTime: 1, endDateTime: 1 }
        }
    ]);
    return result;
});
exports.getSlotDropDownService = getSlotDropDownService;
const deleteSlotService = (loginUserId, slotId) => __awaiter(void 0, void 0, void 0, function* () {
    //check slot not found
    const slot = yield slot_model_1.default.findOne({
        _id: slotId,
        ownerId: loginUserId,
    });
    if (!slot) {
        throw new AppError_1.default(404, "Slot not found");
    }
    const result = yield slot_model_1.default.deleteOne({
        _id: slotId,
        ownerId: loginUserId
    });
    return result;
});
exports.deleteSlotService = deleteSlotService;
