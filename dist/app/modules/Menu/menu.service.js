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
exports.deleteMenuService = exports.updateMenuService = exports.getMenusByRestaurantIdService = exports.getMenusService = exports.createMenuService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const cuisine_model_1 = __importDefault(require("../Cuisine/cuisine.model"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const menu_model_1 = __importDefault(require("./menu.model"));
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const menu_constant_1 = require("./menu.constant");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const createMenuService = (req, loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { cuisineId, name } = payload;
    const slug = (0, slugify_1.default)(name).toLowerCase();
    //check cuisine not found
    const cuisine = yield cuisine_model_1.default.findById(cuisineId);
    if (!cuisine) {
        throw new AppError_1.default(404, "This cuisine not found");
    }
    //check restaurant not found
    const restaurant = yield restaurant_model_1.default.findOne({
        ownerId: loginUserId
    });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    //check menu already existed
    const menu = yield menu_model_1.default.findOne({
        ownerId: loginUserId,
        restaurantId: restaurant._id,
        cuisineId,
        slug
    });
    if (menu) {
        throw new AppError_1.default(409, "Menu is already existed");
    }
    if (!req.file) {
        throw new AppError_1.default(400, "image is required");
    }
    let image = "";
    if (req.file) {
        image = yield (0, uploadImage_1.default)(req);
    }
    //create the menu
    const result = yield menu_model_1.default.create(Object.assign(Object.assign({}, payload), { ownerId: loginUserId, restaurantId: restaurant._id, image,
        slug }));
    return result;
});
exports.createMenuService = createMenuService;
const getMenusService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, menu_constant_1.MenuSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield menu_model_1.default.aggregate([
        {
            $match: { ownerId: new ObjectId(loginUserId) }
        },
        {
            $lookup: {
                from: "menureviews",
                localField: "_id",
                foreignField: "menuId",
                as: "reviews"
            }
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            }
        },
        {
            $lookup: {
                from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
            }
        },
        {
            $unwind: "$cuisine"
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        {
            $project: {
                _id: 1,
                name: 1,
                image: 1,
                price: 1,
                ingredient: 1,
                ratings: 1,
                totalReview: 1,
                cuisineId: 1,
                restaurantId: 1,
                cuisineName: "$cuisine.name",
                createdAt: "$createdAt"
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    const totalMenuResult = yield menu_model_1.default.aggregate([
        {
            $match: { ownerId: new ObjectId(loginUserId) }
        },
        {
            $lookup: {
                from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
            }
        },
        {
            $unwind: "$cuisine"
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalMenuResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getMenusService = getMenusService;
const getMenusByRestaurantIdService = (restaurantId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, menu_constant_1.MenuSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield menu_model_1.default.aggregate([
        {
            $match: { restaurantId: new ObjectId(restaurantId) }
        },
        {
            $lookup: {
                from: "menureviews",
                localField: "_id",
                foreignField: "menuId",
                as: "reviews"
            }
        },
        {
            $addFields: {
                totalReviewers: { $size: "$reviews" },
            }
        },
        {
            $lookup: {
                from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
            }
        },
        {
            $unwind: "$cuisine"
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        {
            $project: {
                _id: 1,
                name: 1,
                image: 1,
                price: 1,
                ingredient: 1,
                ratings: 1,
                totalReviewers: 1,
                cuisineId: 1,
                restaurantId: 1,
                cuisineName: "$cuisine.name",
                createdAt: "$createdAt"
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    const totalMenuResult = yield menu_model_1.default.aggregate([
        {
            $match: { restaurantId: new ObjectId(restaurantId) }
        },
        {
            $lookup: {
                from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
            }
        },
        {
            $unwind: "$cuisine"
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalMenuResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getMenusByRestaurantIdService = getMenusByRestaurantIdService;
const updateMenuService = (req, loginUserId, menuId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cuisineId } = payload;
    //check menu not found
    const menu = yield menu_model_1.default.findOne({
        _id: menuId,
        ownerId: loginUserId,
    });
    if (!menu) {
        throw new AppError_1.default(404, "Menu not found");
    }
    //check cuisine not found
    if (cuisineId) {
        const cuisine = yield cuisine_model_1.default.findById(cuisineId);
        if (!cuisine) {
            throw new AppError_1.default(404, "This cuisine not found");
        }
    }
    //set slug
    if (name) {
        const slug = (0, slugify_1.default)(name).toLowerCase();
        payload.slug = slug;
        const menuExist = yield menu_model_1.default.findOne({
            _id: { $ne: menuId },
            slug
        });
        if (menuExist) {
            throw new AppError_1.default(409, "Sorry! This Menu is already existed");
        }
    }
    //upload the image
    if (req.file) {
        payload.image = yield (0, uploadImage_1.default)(req);
    }
    //update the menu
    const result = yield menu_model_1.default.updateOne({
        _id: menuId,
        ownerId: loginUserId
    }, payload);
    return result;
});
exports.updateMenuService = updateMenuService;
const deleteMenuService = (loginUserId, menuId) => __awaiter(void 0, void 0, void 0, function* () {
    //check menu not found
    const menu = yield menu_model_1.default.findOne({
        _id: menuId,
        ownerId: loginUserId,
    });
    if (!menu) {
        throw new AppError_1.default(404, "Menu not found");
    }
    const result = yield menu_model_1.default.deleteOne({
        _id: menuId,
        ownerId: loginUserId
    });
    return result;
});
exports.deleteMenuService = deleteMenuService;
