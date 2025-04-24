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
exports.getTablesByScheduleAndDiningService = exports.getTablesService = exports.createTableService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const schedule_model_1 = __importDefault(require("../Schedule/schedule.model"));
const table_model_1 = __importDefault(require("./table.model"));
const dining_model_1 = __importDefault(require("../Dining/dining.model"));
const createTableService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalTable, seats, diningId, scheduleId } = payload;
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId,
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    //check schedule
    const schedule = yield schedule_model_1.default.findOne({
        ownerId: loginUserId,
        _id: scheduleId
    });
    if (!schedule) {
        throw new AppError_1.default(404, "Schedule not found");
    }
    const dining = restaurant.dining;
    if (!dining.includes(new ObjectId_1.default(diningId))) {
        throw new AppError_1.default(404, "This dining does not belong to your restaurant, please add this dining to your restaurant");
    }
    //check table is already existed
    const tables = yield table_model_1.default.countDocuments({
        scheduleId,
        ownerId: loginUserId,
        restaurantId: restaurant._id,
        diningId,
    });
    const tableData = [];
    for (let i = 1; i <= Number(totalTable); i++) {
        const tableName = `T-${i + tables}`;
        const slug = (0, slugify_1.default)(tableName).toLowerCase();
        tableData.push({
            name: tableName,
            slug,
            diningId,
            ownerId: loginUserId,
            restaurantId: restaurant._id,
            scheduleId,
            seats,
        });
    }
    //create the multiple Or Single Table 
    const result = yield table_model_1.default.insertMany(tableData);
    return result;
});
exports.createTableService = createTableService;
const getTablesService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    const result = yield table_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId_1.default(loginUserId),
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
                _id: 0,
                scheduleId: "$_id.scheduleId",
                diningId: "$_id.diningId",
                totalSeats: 1,
                totalTables: 1
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
                totalSeats: 1,
                totalTables: 1,
                startDateTime: "$schedule.startDateTime",
                endDateTime: "$schedule.endDateTime",
                diningName: "$dining.name"
            }
        },
        {
            $sort: {
                startDateTime: 1,
                endDateTime: 1
            }
        },
        {
            $match: Object.assign({}, filterQuery)
        },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    //count the total
    const totalTableResult = yield table_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId_1.default(loginUserId),
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
                _id: 0,
                scheduleId: "$_id.scheduleId",
                diningId: "$_id.diningId",
                totalSeats: 1,
                totalTables: 1
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
                totalSeats: 1,
                totalTables: 1,
                startDateTime: "$schedule.startDateTime",
                endDateTime: "$schedule.endDateTime",
                diningName: "$dining.name"
            }
        },
        {
            $match: Object.assign({}, filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalTableResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getTablesService = getTablesService;
const getTablesByScheduleAndDiningService = (loginUserId, scheduleId, diningId) => __awaiter(void 0, void 0, void 0, function* () {
    //check schedule
    const schedule = yield schedule_model_1.default.findOne({
        ownerId: loginUserId,
        _id: scheduleId,
    });
    if (!schedule) {
        throw new AppError_1.default(404, "Schedule not found");
    }
    const dining = yield dining_model_1.default.findById(diningId);
    if (!dining) {
        throw new AppError_1.default(404, "dining not found");
    }
    //check dining
    const myDining = yield restaurant_model_1.default.findOne({
        dining: { $in: [diningId] }
    });
    if (!myDining) {
        throw new AppError_1.default(404, "This dining is not belong to my restaurant");
    }
    const result = yield table_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId_1.default(loginUserId),
                scheduleId: new ObjectId_1.default(scheduleId),
                diningId: new ObjectId_1.default(diningId),
            },
        }
    ]);
    return result;
});
exports.getTablesByScheduleAndDiningService = getTablesByScheduleAndDiningService;
