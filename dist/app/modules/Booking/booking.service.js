"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsService = exports.createBookingWithPaymentService = exports.createBookingWithoutPaymentService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const schedule_model_1 = __importDefault(require("../Schedule/schedule.model"));
const booking_model_1 = __importDefault(require("./booking.model"));
const payment_model_1 = __importDefault(require("../Payment/payment.model"));
const dining_model_1 = __importDefault(require("../Dining/dining.model"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const getPercentageValue_1 = __importDefault(require("../../utils/getPercentageValue"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const booking_constant_1 = require("./booking.constant");
const createBookingWithoutPaymentService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { scheduleId, diningId, guest } = payload;
    const dining = yield dining_model_1.default.findById(diningId);
    if (!dining) {
        throw new AppError_1.default(404, 'This dining not found');
    }
    //check schedule not found
    const schedule = yield schedule_model_1.default.findById(scheduleId);
    if (!schedule) {
        throw new AppError_1.default(404, "Schedule not found");
    }
    const availableSeats = schedule.availableSeats;
    if (availableSeats < guest) {
        throw new AppError_1.default(400, "There are no available seats during this schedule");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //database-process-01
        //create the booking
        const newBooking = yield booking_model_1.default.create([{
                userId: loginUserId,
                scheduleId,
                restaurantId: schedule.restaurantId,
                diningId,
                guest,
            }], { session });
        //database-process-02
        //update the schedule
        yield schedule_model_1.default.updateOne({ _id: scheduleId, availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -guest } }, // Decrease availableSeats
        { session });
        yield session.commitTransaction();
        yield session.endSession();
        return newBooking[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.createBookingWithoutPaymentService = createBookingWithoutPaymentService;
const createBookingWithPaymentService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { scheduleId, diningId, amount, guest } = payload;
    const ObjectId = mongoose_1.Types.ObjectId;
    const dining = yield dining_model_1.default.findById(diningId);
    if (!dining) {
        throw new AppError_1.default(404, 'This dining not found');
    }
    //check schedule not found
    const schedule = yield schedule_model_1.default.findById(scheduleId);
    if (!schedule) {
        throw new AppError_1.default(404, "Schedule not found");
    }
    const availableSeats = schedule.availableSeats;
    if (availableSeats < guest) {
        throw new AppError_1.default(400, "There are no available seats during this schedule");
    }
    const restaurant = yield restaurant_model_1.default.findById(schedule.restaurantId);
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    //calculation of canCellationCharge
    const cancellationCharge = (0, getPercentageValue_1.default)(amount, restaurant.cancellationPercentage);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //database-process-01
        //create the booking
        const newBooking = yield booking_model_1.default.create([{
                userId: loginUserId,
                scheduleId,
                restaurantId: schedule.restaurantId,
                diningId,
                amount,
                cancellationCharge,
                guest,
            }], { session });
        //database-process-02
        //update the schedule
        yield schedule_model_1.default.updateOne({ _id: scheduleId, availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -guest } }, // Decrease availableSeats
        { session });
        //database-process-03
        //create the payment
        const transactionId = new ObjectId().toString();
        yield payment_model_1.default.create({
            bookingId: (_a = newBooking[0]) === null || _a === void 0 ? void 0 : _a._id,
            amount,
            transactionId
        });
        yield session.commitTransaction();
        yield session.endSession();
        return newBooking[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.createBookingWithPaymentService = createBookingWithPaymentService;
const getBookingsService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "asc", sortBy = "startDateTime", date } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy", "date"]) // Any additional filters
    ;
    console.log(query);
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, booking_constant_1.BookingSearchFields);
    }
    //console.dir(searchQuery, {depth:null})
    //5 setup filters
    let filterQuery = {};
    //check if only filter by date
    if (date) {
        const start = `${date}T00:00:00.000+00:00`;
        const end = `${date}T23:59:59.999+00:00`;
        filterQuery = Object.assign(Object.assign({}, filterQuery), { "schedule.startDateTime": { $gte: new Date(start), $lte: new Date(end) } });
    }
    //add additional filters
    if (filters) {
        filterQuery = Object.assign(Object.assign({}, filterQuery), (0, QueryBuilder_1.makeFilterQuery)(filters));
    }
    //check restaurant exist
    const restaurant = yield restaurant_model_1.default.findOne({ ownerId: loginUserId });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    const result = yield booking_model_1.default.aggregate([
        {
            $match: { restaurantId: new ObjectId(restaurant._id) }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
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
            $match: Object.assign(Object.assign({}, filterQuery), searchQuery)
        },
        {
            $project: {
                _id: "$_id",
                userId: "$userId",
                customerName: "$user.fullName",
                customerEmail: "$user.email",
                customerPhone: "$user.phone",
                scheduleId: "$scheduleId",
                startDateTime: "$schedule.startDateTime",
                endDateTime: "$schedule.endDateTime",
                amount: "$amount",
                guest: "$guest",
                cancellationCharge: "$cancellationCharge",
                status: "$status",
                paymentStatus: "$paymentStatus",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        },
        {
            $sort: { "startDateTime": 1, endDateTime: 1 }, //after projection
        },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    // total count 
    const totalBookingResult = yield booking_model_1.default.aggregate([
        {
            $match: { restaurantId: new ObjectId(restaurant._id) }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
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
            $match: Object.assign(Object.assign({}, filterQuery), searchQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalBookingResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result
    };
});
exports.getBookingsService = getBookingsService;
