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
exports.deleteDiningService = exports.updateDiningService = exports.getMyDiningsService = exports.getDiningDropDownService = exports.getDiningListService = exports.createDiningService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const dining_model_1 = __importDefault(require("./dining.model"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const dining_constant_1 = require("./dining.constant");
const createDiningService = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(name).toLowerCase();
    //check Dining is already existed
    const dining = yield dining_model_1.default.findOne({ slug });
    if (dining) {
        throw new AppError_1.default(409, 'This dining is already existed');
    }
    const result = yield dining_model_1.default.create({ name, slug });
    return result;
});
exports.createDiningService = createDiningService;
const getDiningListService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, dining_constant_1.DiningSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield dining_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    //total count
    const totalDiningResult = yield dining_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalDiningResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getDiningListService = getDiningListService;
const getDiningDropDownService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dining_model_1.default.find().select('-createdAt -updatedAt').sort('-createdAt');
    return result;
});
exports.getDiningDropDownService = getDiningDropDownService;
const getMyDiningsService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.default.aggregate([
        {
            $match: {
                ownerId: new ObjectId_1.default(loginUserId)
            }
        },
        {
            $lookup: {
                from: "dinings",
                localField: "dining",
                foreignField: "_id",
                as: "dinings"
            }
        },
        {
            $unwind: "$dinings"
        },
        {
            $project: {
                _id: "$dinings._id",
                name: "$dinings.name"
            }
        }
    ]);
    return result;
});
exports.getMyDiningsService = getMyDiningsService;
const updateDiningService = (diningId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const dining = yield dining_model_1.default.findById(diningId);
    if (!dining) {
        throw new AppError_1.default(404, 'This dining not found');
    }
    const slug = (0, slugify_1.default)(name).toLowerCase();
    const diningExist = yield dining_model_1.default.findOne({ _id: { $ne: diningId }, slug });
    if (diningExist) {
        throw new AppError_1.default(409, 'Sorry! This dining name is already taken');
    }
    const result = yield dining_model_1.default.updateOne({ _id: diningId }, {
        name,
        slug
    });
    return result;
});
exports.updateDiningService = updateDiningService;
const deleteDiningService = (diningId) => __awaiter(void 0, void 0, void 0, function* () {
    const dining = yield dining_model_1.default.findById(diningId);
    if (!dining) {
        throw new AppError_1.default(404, 'This dining not found');
    }
    //check if diningId is associated with restaurant
    const associateWithRestaurant = yield restaurant_model_1.default.findOne({ dining: { $in: [diningId] } });
    if (associateWithRestaurant) {
        throw new AppError_1.default(409, 'Failled to delete, This dining is associated with restaurant');
    }
    const result = yield dining_model_1.default.deleteOne({ _id: dining });
    return result;
});
exports.deleteDiningService = deleteDiningService;
