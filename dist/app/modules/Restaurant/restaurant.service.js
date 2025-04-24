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
exports.deleteRestaurantService = exports.updateRestaurantImgService = exports.updateRestaurantService = exports.approveRestaurantService = exports.getSingleRestaurantService = exports.changeRestaurantStatusService = exports.getOwnerRestaurantService = exports.getUserRestaurantsService = exports.getRestaurantsService = exports.createRestaurantService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const restaurant_model_1 = __importDefault(require("./restaurant.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const restaurant_constant_1 = require("./restaurant.constant");
const socialMedia_model_1 = __importDefault(require("../SocialMedia/socialMedia.model"));
const menu_model_1 = __importDefault(require("../Menu/menu.model"));
const favourite_model_1 = __importDefault(require("../Favourite/favourite.model"));
const review_model_1 = __importDefault(require("../Review/review.model"));
const menuReview_model_1 = __importDefault(require("../MenuReview/menuReview.model"));
const schedule_model_1 = __importDefault(require("../Schedule/schedule.model"));
const booking_model_1 = __importDefault(require("../Booking/booking.model"));
const notification_model_1 = __importDefault(require("../Notification/notification.model"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const createRestaurantService = (req, ownerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload;
    //check restaurant owner is already exist
    const owner = yield restaurant_model_1.default.findOne({ ownerId });
    if (owner) {
        throw new AppError_1.default(409, "Sorry! You have already a restaurant");
    }
    //check restaurant
    const restaurant = yield restaurant_model_1.default.findOne({ name });
    if (restaurant) {
        throw new AppError_1.default(409, "This restaurant name is already taken or existed");
    }
    if (!req.file) {
        throw new AppError_1.default(400, "image is required");
    }
    if (req.file) {
        payload.restaurantImg = yield (0, uploadImage_1.default)(req);
    }
    //create the restaurant
    const result = yield restaurant_model_1.default.create(Object.assign(Object.assign({}, payload), { ownerId }));
    return result;
});
exports.createRestaurantService = createRestaurantService;
const getRestaurantsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, restaurant_constant_1.RestaurantSearchFields);
        searchQuery = {
            $or: [
                ...searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.$or,
                { keywords: { $in: [new RegExp(searchTerm, "i")] } }
            ]
        };
    }
    //console.dir(searchQuery, {depth:null})
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield restaurant_model_1.default.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner", //divide the array into the object=make seprate document
        },
        {
            $lookup: {
                from: "menus", // Menu collection
                localField: "_id",
                foreignField: "restaurantId",
                as: "menus",
            }
        },
        {
            $lookup: {
                from: "cuisines", // Cuisine collection
                localField: "menus.cuisineId",
                foreignField: "_id",
                as: "cuisine",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "restaurantId",
                as: "reviews"
            }
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            }
        },
        {
            $project: {
                _id: 1,
                ownerId: 1,
                name: 1,
                location: 1,
                keywords: 1,
                features: 1,
                cancellationCharge: 1,
                discount: 1,
                ratings: 1,
                restaurantImg: 1,
                totalReview: 1,
                status: 1,
                approved: 1,
                createdAt: 1,
                updatedAt: 1,
                ownerName: "$owner.fullName",
                ownerEmail: "$owner.email",
                ownerPhone: "$owner.phone",
                ownerImg: "$owner.profileImg",
                ownerAddress: "$owner.address"
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count of matching users
    const totalRestaurantResult = yield restaurant_model_1.default.aggregate([
        {
            $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'owner' }
        },
        {
            $unwind: "$owner"
        },
        {
            $lookup: {
                from: "menus", // Menu collection
                localField: "_id",
                foreignField: "restaurantId",
                as: "menus",
            }
        },
        {
            $lookup: {
                from: "cuisines", // Cuisine collection
                localField: "menus.cuisineId",
                foreignField: "_id",
                as: "cuisine",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $count: "totalCount" },
    ]);
    const totalCount = ((_a = totalRestaurantResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getRestaurantsService = getRestaurantsService;
const getUserRestaurantsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, restaurant_constant_1.UserRestaurantSearchFields);
        searchQuery = {
            $or: [
                ...searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.$or,
                { keywords: { $in: [new RegExp(searchTerm, "i")] } }
            ]
        };
    }
    //console.dir(searchQuery, {depth:null})
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield restaurant_model_1.default.aggregate([
        {
            $match: {
                status: "active",
                approved: "accepted",
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $lookup: {
                from: "menus", // Menu collection
                localField: "_id",
                foreignField: "restaurantId",
                as: "menus",
            }
        },
        {
            $lookup: {
                from: "cuisines", // Cuisine collection
                localField: "menus.cuisineId",
                foreignField: "_id",
                as: "cuisine",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "restaurantId",
                as: "reviews"
            }
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            }
        },
        {
            $project: {
                _id: 1,
                ownerId: 1,
                name: 1,
                location: 1,
                keywords: 1,
                features: 1,
                cancellationCharge: 1,
                discount: 1,
                ratings: 1,
                totalReview: 1,
                createdAt: 1,
                updatedAt: 1,
                ownerName: "$owner.fullName",
                ownerEmail: "$owner.email",
                ownerPhone: "$owner.phone",
                ownerImg: "$owner.profileImg",
                ownerAddress: "$owner.address",
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count of matching users
    const totalRestaurantResult = yield restaurant_model_1.default.aggregate([
        {
            $match: {
                status: "active",
                approved: "accepted",
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $lookup: {
                from: "menus", // Menu collection
                localField: "_id",
                foreignField: "restaurantId",
                as: "menus",
            }
        },
        {
            $lookup: {
                from: "cuisines", // Cuisine collection
                localField: "menus.cuisineId",
                foreignField: "_id",
                as: "cuisine",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $count: "totalCount" },
    ]);
    const totalCount = ((_a = totalRestaurantResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getUserRestaurantsService = getUserRestaurantsService;
const getOwnerRestaurantService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: new ObjectId(loginUserId),
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    return restaurant;
});
exports.getOwnerRestaurantService = getOwnerRestaurantService;
const getSingleRestaurantService = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const restaurant = yield restaurant_model_1.default.aggregate([
        {
            $match: {
                _id: new ObjectId(restaurantId)
            }
        },
        {
            $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'owner' }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                ownerId: 1,
                name: 1,
                cuisine: 1,
                dining: 1,
                website: 1,
                location: 1,
                keywords: 1,
                price: 1,
                features: 1,
                cancellationCharge: 1,
                discount: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                ownerName: "$owner.fullName",
                ownerEmail: "$owner.email",
                ownerPhone: "$owner.phone",
                ownerImg: "$owner.profileImg",
                ownerAddress: "$owner.address"
            },
        },
    ]);
    if (restaurant.length === 0) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    return restaurant[0];
});
exports.getSingleRestaurantService = getSingleRestaurantService;
const changeRestaurantStatusService = (restaurantId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = payload;
    const restaurant = yield restaurant_model_1.default.findById(restaurantId);
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    //transaction & rollback part
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //database-process-01
        //update the restaurant
        const result = yield restaurant_model_1.default.updateOne({ _id: new ObjectId_1.default(restaurantId) }, { status: status }, { session });
        //database-process-02
        //create a notification
        yield notification_model_1.default.create({
            userId: restaurant === null || restaurant === void 0 ? void 0 : restaurant.ownerId,
            title: "Restaurant Status",
            message: `Your Restaurant is ${status === "active" ? "activated" : "deactivated"} successfully`,
            type: `${status === "active" ? "success" : "error"}`
        });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.changeRestaurantStatusService = changeRestaurantStatusService;
const approveRestaurantService = (restaurantId, approved) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const restaurant = yield restaurant_model_1.default.findById(restaurantId);
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    //transaction & rollback part
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //database-process-01
        //update the restaurant
        const result = yield restaurant_model_1.default.updateOne({ _id: new ObjectId(restaurantId) }, { approved });
        //database-process-02
        //create a notification
        yield notification_model_1.default.create({
            userId: restaurant === null || restaurant === void 0 ? void 0 : restaurant.ownerId,
            title: "Approval Status",
            message: `Your Restaurant is ${approved} successfully`,
            type: `${approved === "accepted" ? "success" : "error"}`,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.approveRestaurantService = approveRestaurantService;
const updateRestaurantService = (ownerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    const result = yield restaurant_model_1.default.updateOne({ ownerId: new ObjectId(ownerId) }, payload);
    return result;
});
exports.updateRestaurantService = updateRestaurantService;
const updateRestaurantImgService = (req, loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId,
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    if (!req.file) {
        throw new AppError_1.default(400, "image is required");
    }
    //uploaded-image
    const image = yield (0, uploadImage_1.default)(req);
    const result = yield restaurant_model_1.default.updateOne({ ownerId: loginUserId }, { restaurantImg: image });
    return result;
});
exports.updateRestaurantImgService = updateRestaurantImgService;
const deleteRestaurantService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant Not Found");
    }
    //check if restaurantId is associated with booking
    const associateWithBooking = yield booking_model_1.default.findOne({ restaurantId: restaurant._id });
    if (associateWithBooking) {
        throw new AppError_1.default(409, 'Failled to delete, This restaurant is associated with booking');
    }
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete social media
        yield socialMedia_model_1.default.deleteOne({ ownerId: new ObjectId(loginUserId) }, { session });
        //delete menus
        yield menu_model_1.default.deleteMany({ ownerId: new ObjectId(loginUserId) }, { session });
        //delete favourite list
        yield favourite_model_1.default.deleteMany({ restaurantId: new ObjectId(restaurant._id) }, { session });
        //delete the reviews
        yield review_model_1.default.deleteMany({ restaurantId: new ObjectId(restaurant._id) }, { session });
        //delete the menu reviews
        yield menuReview_model_1.default.deleteMany({ restaurantId: new ObjectId(restaurant._id) }, { session });
        //delete the schedule
        yield schedule_model_1.default.deleteMany({ restaurantId: new ObjectId(restaurant._id) }, { session });
        //delete restaurant
        const result = yield restaurant_model_1.default.deleteOne({ ownerId: new ObjectId(loginUserId) }, { session });
        //transaction success
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.deleteRestaurantService = deleteRestaurantService;
