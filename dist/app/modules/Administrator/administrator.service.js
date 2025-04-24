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
exports.getSingleAdministratorService = exports.deleteAdministratorService = exports.getAdministratorsService = exports.updateAdministratorService = exports.updateAccessService = exports.createAdministratorService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("../User/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const administrator_model_1 = __importDefault(require("./administrator.model"));
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const administrator_constant_1 = require("./administrator.constant");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const createAdministratorService = (req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { administratorData, access } = payload;
    const user = yield user_model_1.default.findOne({ email: administratorData.email });
    if (user) {
        throw new AppError_1.default(409, 'Email is already existed');
    }
    if (!administratorData.password) {
        administratorData.password = config_1.default.default_password;
    }
    if (req.file) {
        administratorData.profileImg = yield (0, uploadImage_1.default)(req);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newUser = yield user_model_1.default.create([
            Object.assign(Object.assign({}, administratorData), { role: "administrator" }),
        ], { session });
        //create the administrator
        yield administrator_model_1.default.create([
            {
                userId: newUser[0]._id,
                access
            },
        ], { session });
        //transaction success
        yield session.commitTransaction();
        yield session.endSession();
        newUser[0].password = "";
        return newUser[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.createAdministratorService = createAdministratorService;
const updateAccessService = (administratorId, access) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield administrator_model_1.default.findById(administratorId);
    if (!administrator) {
        throw new AppError_1.default(404, "Administrator Not found");
    }
    //update the administrator
    const result = yield administrator_model_1.default.updateOne({ _id: administratorId }, { access });
    return result;
});
exports.updateAccessService = updateAccessService;
const getAdministratorsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, administrator_constant_1.AdministratorSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield administrator_model_1.default.aggregate([
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
            $project: {
                _id: 1,
                userId: 1,
                access: 1,
                name: "$user.fullName",
                email: "$user.email",
                phone: "$user.phone",
                profileImg: "$user.profileImg",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    //total count
    const administratorResultCount = yield administrator_model_1.default.aggregate([
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
            $project: {
                _id: 1,
                userId: 1,
                access: 1,
                name: "$user.fullName",
                email: "$user.email",
                phone: "$user.phone",
                profileImg: "$user.profileImg",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = administratorResultCount[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getAdministratorsService = getAdministratorsService;
const deleteAdministratorService = (administratorId) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield administrator_model_1.default.findById(administratorId);
    if (!administrator) {
        throw new AppError_1.default(404, "Administrator Not found");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete the administrator
        const result = yield administrator_model_1.default.deleteOne({
            _id: administratorId
        }, { session });
        //delete the user
        yield user_model_1.default.deleteOne({ _id: administrator.userId }, { session });
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
exports.deleteAdministratorService = deleteAdministratorService;
const getSingleAdministratorService = (administratorId) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield administrator_model_1.default.findById(administratorId);
    if (!administrator) {
        throw new AppError_1.default(404, "Administrator Not found");
    }
    return administrator;
});
exports.getSingleAdministratorService = getSingleAdministratorService;
const updateAdministratorService = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield administrator_model_1.default.findOne({ userId });
    if (!administrator) {
        throw new AppError_1.default(404, "Administrator Not Found");
    }
    const result = user_model_1.default.updateOne({ _id: userId }, payload);
    return result;
});
exports.updateAdministratorService = updateAdministratorService;
