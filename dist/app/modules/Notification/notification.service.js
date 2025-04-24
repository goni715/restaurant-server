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
exports.deleteNotificationService = exports.markAsReadService = exports.getUserNotificationsService = exports.createNotificationService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const notification_model_1 = __importDefault(require("./notification.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const notification_constant_1 = require("./notification.constant");
const createNotificationService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(payload.userId);
    if (!user) {
        throw new AppError_1.default(404, "User Not Found");
    }
    const result = yield notification_model_1.default.create(payload);
    return result;
});
exports.createNotificationService = createNotificationService;
const getUserNotificationsService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, notification_constant_1.NotificationSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield notification_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({ userId: new ObjectId(loginUserId) }, searchQuery), filterQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    // total count of matching notifications
    const totalCount = yield notification_model_1.default.countDocuments(Object.assign(Object.assign({ userId: new ObjectId(loginUserId) }, searchQuery), filterQuery));
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
exports.getUserNotificationsService = getUserNotificationsService;
const markAsReadService = (loginUserId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const notification = yield notification_model_1.default.findOne({ userId: loginUserId, _id: notificationId });
    if (!notification) {
        throw new AppError_1.default(404, "Notification Not Found");
    }
    const result = yield notification_model_1.default.updateOne({ _id: new ObjectId(notificationId) }, { isRead: true });
    return result;
});
exports.markAsReadService = markAsReadService;
const deleteNotificationService = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.default.findOne({ _id: notificationId });
    if (!notification) {
        throw new AppError_1.default(404, "Notification Not Found");
    }
    const result = yield notification_model_1.default.deleteOne({ _id: notificationId });
    return result;
});
exports.deleteNotificationService = deleteNotificationService;
