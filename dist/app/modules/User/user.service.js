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
exports.getSuggestedUsersService = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("./user.model"));
const friend_model_1 = __importDefault(require("../Friend/friend.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const user_constant_1 = require("./user.constant");
const getSuggestedUsersService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, user_constant_1.UserSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    //get friendIds
    const data = yield friend_model_1.default.aggregate([
        {
            $match: { friends: { $in: [new ObjectId(loginUserId)] } },
        },
        {
            $unwind: "$friends", // Unwind to process each friend separately
        },
        {
            $match: { friends: { $ne: new ObjectId(loginUserId) } }, // Exclude the logged-in user
        },
        {
            $group: {
                _id: null,
                friendIds: { $addToSet: "$friends" }, // Collect friend IDs into an array
            },
        },
        {
            $project: { _id: 0, friendIds: 1 }, // Return only the array of friend IDs
        },
    ]);
    const friendIds = data.length > 0 ? data[0].friendIds : [];
    const result = yield user_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({ _id: {
                    $nin: [...friendIds, new ObjectId(loginUserId)],
                }, role: {
                    $ne: "admin",
                } }, searchQuery), filterQuery),
        },
        {
            $project: {
                _id: "$_id",
                fullName: "$fullName",
                email: "$email",
                country: "$country",
                university: "$university",
                profession: "$profession",
                role: "$role",
                createdAt: "$createdAt",
            },
        },
        { $sort: { [sortBy]: sortDirection } }, // Sorting
        { $skip: skip }, // Pagination: Skip previous pages
        { $limit: Number(limit) }, // Pagination: Limit the number of results
    ]);
    // total count of matching users
    const totalCount = yield user_model_1.default.countDocuments(Object.assign(Object.assign({ _id: { $nin: [...friendIds, new ObjectId(loginUserId)] }, role: { $ne: "admin" } }, searchQuery), filterQuery));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages: Math.ceil(totalCount / Number(limit)),
            total: totalCount,
        },
        data: result,
    };
});
exports.getSuggestedUsersService = getSuggestedUsersService;
