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
exports.updateInfoService = exports.getAllInfoService = exports.deleteInfoService = exports.createInfoService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const info_model_1 = __importDefault(require("./info.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const info_constant_1 = require("./info.constant");
const createInfoService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subTitle } = payload;
    //check if title is existed
    const titleExist = yield info_model_1.default.findOne({ title });
    if (titleExist) {
        throw new AppError_1.default(409, 'Title is already existed');
    }
    //check if subTitle is existed
    const subTitleExist = yield info_model_1.default.findOne({ subTitle });
    if (subTitleExist) {
        throw new AppError_1.default(409, 'Sub Title is already existed');
    }
    //create an info
    const result = yield info_model_1.default.create(payload);
    return result;
});
exports.createInfoService = createInfoService;
const deleteInfoService = (infoId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    //check infoId doesn't exist
    const info = yield info_model_1.default.findById(infoId);
    if (!info) {
        throw new AppError_1.default(404, `This infoId doesn't exist`);
    }
    const result = yield info_model_1.default.deleteOne({ _id: new ObjectId(infoId) });
    return result;
});
exports.deleteInfoService = deleteInfoService;
const getAllInfoService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Extract query parameters
    const { searchTerm, // Text to search
    page = 1, // Default to page 1
    limit = 10, // Default to 10 results per page // Default sort field
    sortOrder = 'desc', sortBy: SortField } = query, // Default sort order
    filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    // 3. Set up sorting
    let sortBy = 'createdAt';
    if (SortField) {
        sortBy = SortField;
    }
    const sorting = sortOrder === 'asc' ? 1 : -1;
    let finalQuery = {};
    if (searchTerm) {
        const searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, info_constant_1.InfoSearchFields);
        finalQuery = Object.assign(Object.assign({}, finalQuery), searchQuery);
    }
    // 6. Execute query with pagination and sorting
    const result = yield info_model_1.default.find(finalQuery)
        .skip(skip)
        .limit(Number(limit))
        .sort({ [sortBy]: sorting });
    // 7. Get total count for pagination
    const total = yield info_model_1.default.countDocuments(finalQuery);
    const totalPages = Math.ceil(total / Number(limit));
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total,
        },
        data: result
    };
});
exports.getAllInfoService = getAllInfoService;
const updateInfoService = (infoId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    //check infoId doesn't exist
    const info = yield info_model_1.default.findById(infoId);
    if (!info) {
        throw new AppError_1.default(404, `This infoId doesn't exist`);
    }
    const result = yield info_model_1.default.updateOne({ _id: new ObjectId(infoId) }, payload);
    return result;
});
exports.updateInfoService = updateInfoService;
