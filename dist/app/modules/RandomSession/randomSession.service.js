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
exports.removeRandomPlayerService = exports.acceptRandomPlayerService = exports.getRandomSesssionsService = exports.createRandomSessionService = void 0;
const mongoose_1 = require("mongoose");
const quiz_model_1 = __importDefault(require("../Quiz/quiz.model"));
const randomSession_model_1 = __importDefault(require("./randomSession.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const randomSession_constant_1 = require("./randomSession.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createRandomSessionService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    //get the quizIds
    const data = yield quiz_model_1.default.find({}, "_id").lean();
    const quizIds = data === null || data === void 0 ? void 0 : data.map((quiz) => quiz._id);
    const result = yield randomSession_model_1.default.create({
        players: [loginUserId],
        quizzes: quizIds
    });
    return result;
});
exports.createRandomSessionService = createRandomSessionService;
const getRandomSesssionsService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, randomSession_constant_1.RandomSessionSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield randomSession_model_1.default.aggregate([
        {
            $match: {
                players: { $not: { $in: [new ObjectId(loginUserId)] } },
                status: "active",
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'players',
                foreignField: '_id',
                as: 'player'
            }
        },
        {
            $unwind: '$player'
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery), // Apply search & filter queries
        },
        {
            $project: {
                gameSessionId: "$_id",
                _id: 0,
                playerId: "$player._id",
                playerName: "$player.fullName",
                playerEmail: "$player.email",
                status: "$status",
                createdAt: "$createdAt",
            }
        },
        { $skip: skip }, // Pagination - Skip the previous pages
        { $limit: Number(limit) }, // Pagination - Limit the number of results
        { $sort: { [sortBy]: sortDirection } }, // Sorting
    ]);
    // 6. Count total for pagination
    const totalSessionResult = yield randomSession_model_1.default.aggregate([
        {
            $match: {
                players: { $not: { $in: [new ObjectId(loginUserId)] } },
                status: "active",
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'players',
                foreignField: '_id',
                as: 'player'
            }
        },
        {
            $unwind: '$player'
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery), // Apply search & filter queries
        },
        { $count: "totalCount" }, // Count the total number
    ]);
    const totalCount = ((_a = totalSessionResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getRandomSesssionsService = getRandomSesssionsService;
const acceptRandomPlayerService = (loginUserId, gameSessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const randomGameSession = yield randomSession_model_1.default.findById(gameSessionId);
    if (!randomGameSession) {
        throw new AppError_1.default(404, "This gameSessionId not found");
    }
    const randomSession = yield randomSession_model_1.default.findOne({
        _id: new ObjectId(gameSessionId),
        players: { $in: [loginUserId] },
        status: "active"
    });
    if (randomSession) {
        throw new AppError_1.default(400, "You have no access to update the status");
    }
    const result = yield randomSession_model_1.default.updateOne({ _id: new ObjectId(gameSessionId) }, {
        $push: { players: new mongoose_1.Types.ObjectId(loginUserId) },
        $set: { status: "accepted" },
    });
    return result;
});
exports.acceptRandomPlayerService = acceptRandomPlayerService;
const removeRandomPlayerService = (gameSessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const randomGameSession = yield randomSession_model_1.default.findById(gameSessionId);
    if (!randomGameSession) {
        throw new AppError_1.default(404, "This gameSessionId not found");
    }
    const result = yield randomSession_model_1.default.updateOne({ _id: new ObjectId(gameSessionId) }, { status: "removed" });
    return result;
});
exports.removeRandomPlayerService = removeRandomPlayerService;
