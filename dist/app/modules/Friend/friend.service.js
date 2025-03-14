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
exports.removeFriendService = exports.getMyFriendsService = exports.makeFriendService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const friend_model_1 = __importDefault(require("./friend.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const friend_constant_1 = require("./friend.constant");
const makeFriendService = (loginUserId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    if (loginUserId === friendId) {
        throw new AppError_1.default(409, "This friendId is your id");
    }
    //check this user is already existed in your friend list
    const friend = yield friend_model_1.default.findOne({
        friends: { $all: [loginUserId, friendId] },
    });
    if (friend) {
        throw new AppError_1.default(409, "This user is already existed in your friend list");
    }
    //make the friend
    const result = yield friend_model_1.default.create({
        friends: [loginUserId, friendId],
    });
    return result;
});
exports.makeFriendService = makeFriendService;
const getMyFriendsService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { searchTerm, // Text to search
    page = 1, // Default to page 1
    limit = 10, // Default to 10 results per page // Default sort field
    sortOrder = "desc", sortBy = "createdAt" } = query, // Default sort order
    filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, friend_constant_1.FriendSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    //check this user is already existed in your friend list
    const result = yield friend_model_1.default.aggregate([
        {
            $match: { friends: { $in: [new ObjectId(loginUserId)] } },
        },
        {
            $unwind: "$friends", // Unwind the friends array to process each friend separately
        },
        {
            $match: { friends: { $ne: new ObjectId(loginUserId) } }, // Exclude the logged-in user
        },
        {
            $lookup: {
                from: "users", // Collection name of users
                localField: "friends",
                foreignField: "_id",
                as: "friendDetails",
            },
        },
        {
            $unwind: "$friendDetails", // Flatten the friendDetails array
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery), // Apply search & filter queries
        },
        {
            $project: {
                _id: "$friendDetails._id",
                fullName: "$friendDetails.fullName",
                email: "$friendDetails.email",
                country: "$friendDetails.country",
                university: "$friendDetails.university",
                profession: "$friendDetails.profession",
                createdAt: "$createdAt",
            },
        },
        { $skip: skip }, // Pagination - Skip the previous pages
        { $limit: Number(limit) }, // Pagination - Limit the number of results
        { $sort: { [sortBy]: sortDirection } }, // Sorting
    ]);
    // 6. Count total friends for pagination
    const totalFriendsResult = yield friend_model_1.default.aggregate([
        { $match: { friends: { $in: [new ObjectId(loginUserId)] } } },
        { $unwind: "$friends" },
        { $match: { friends: { $ne: new ObjectId(loginUserId) } } },
        {
            $lookup: {
                from: "users",
                localField: "friends",
                foreignField: "_id",
                as: "friendDetails",
            },
        },
        { $unwind: "$friendDetails" },
        { $match: Object.assign(Object.assign({}, searchQuery), filterQuery) }, // Apply search & filter queries
        { $count: "totalFriends" }, // Count the total number of matching friends
    ]);
    const totalFriends = ((_a = totalFriendsResult[0]) === null || _a === void 0 ? void 0 : _a.totalFriends) || 0;
    const totalPages = Math.ceil(totalFriends / Number(limit));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalFriends,
        },
        data: result,
    };
    //searchQuery
    //   {
    //     $match: searchQuery
    //         ? {
    //             $or: [
    //                 { "friendDetails.fullName": { $regex: searchQuery, $options: "i" } },
    //                 { "friendDetails.email": { $regex: searchQuery, $options: "i" } }
    //             ]
    //         }
    //         : {}
    //   }
    // 5. Setup filters
    //    let filterQuery: any = {};
    //    if (country) {
    //      filterQuery["friendDetails.country"] = country;
    //    }
    //    if (profession) {
    //      filterQuery["friendDetails.profession"] = profession;
    //    }
});
exports.getMyFriendsService = getMyFriendsService;
const removeFriendService = (loginUserId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    if (loginUserId === friendId) {
        throw new AppError_1.default(409, "This friendId is your id");
    }
    //check this user is not already existed in your friend list
    const friend = yield friend_model_1.default.findOne({
        friends: { $all: [loginUserId, friendId] },
    });
    if (!friend) {
        throw new AppError_1.default(404, "This user is not existed in your friend list");
    }
    //remove friend
    const result = yield friend_model_1.default.deleteOne({
        friends: {
            $all: [new mongoose_1.Types.ObjectId(loginUserId), new mongoose_1.Types.ObjectId(friendId)],
        },
    });
    return result;
});
exports.removeFriendService = removeFriendService;
