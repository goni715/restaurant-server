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
exports.deleteCuisineService = exports.updateCuisineService = exports.getCuisineDropDownService = exports.getCuisinesService = exports.createCuisineService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const cuisine_model_1 = __importDefault(require("./cuisine.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const menu_model_1 = __importDefault(require("../Menu/menu.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const cuisine_constant_1 = require("./cuisine.constant");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const createCuisineService = (req, name) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(name).toLowerCase();
    //check cuisine is already existed
    const cuisine = yield cuisine_model_1.default.findOne({ slug });
    if (cuisine) {
        throw new AppError_1.default(409, 'This cuisine is already existed');
    }
    // if(!req.file){
    //     throw new AppError(400, "image is required");
    // }
    let image = "";
    if (req.file) {
        //for local machine file path
        image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
    }
    const result = yield cuisine_model_1.default.create({
        name,
        image,
        slug
    });
    return result;
});
exports.createCuisineService = createCuisineService;
const getCuisinesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, cuisine_constant_1.CuisineSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield cuisine_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    //total count
    const totalCuisineResult = yield cuisine_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCuisineResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getCuisinesService = getCuisinesService;
const getCuisineDropDownService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cuisine_model_1.default.find().select('-createdAt -updatedAt -slug -image').sort('-createdAt');
    return result;
});
exports.getCuisineDropDownService = getCuisineDropDownService;
const updateCuisineService = (req, cuisineId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cuisine = yield cuisine_model_1.default.findById(cuisineId);
    if (!cuisine) {
        throw new AppError_1.default(404, 'This cuisine not found');
    }
    if (payload === null || payload === void 0 ? void 0 : payload.name) {
        const slug = (0, slugify_1.default)(payload.name).toLowerCase();
        payload.slug = slug;
        const cuisineExist = yield cuisine_model_1.default.findOne({
            _id: { $ne: cuisineId },
            slug
        });
        if (cuisineExist) {
            throw new AppError_1.default(409, "Sorry! This cuisine is already taken");
        }
    }
    //upload image
    if (req.file) {
        //for local machine file path
        payload.image = yield (0, uploadImage_1.default)(req);
    }
    const result = yield cuisine_model_1.default.updateOne({ _id: cuisineId }, payload);
    return result;
});
exports.updateCuisineService = updateCuisineService;
const deleteCuisineService = (cuisineId) => __awaiter(void 0, void 0, void 0, function* () {
    const cuisine = yield cuisine_model_1.default.findById(cuisineId);
    if (!cuisine) {
        throw new AppError_1.default(404, 'This quisine not found');
    }
    //check if cuisineId is associated with menu
    const associateWithMenu = yield menu_model_1.default.findOne({ cuisineId });
    if (associateWithMenu) {
        throw new AppError_1.default(409, 'Failled to delete, This cusine is associated with menu');
    }
    const result = yield cuisine_model_1.default.deleteOne({ _id: cuisineId });
    return result;
});
exports.deleteCuisineService = deleteCuisineService;
