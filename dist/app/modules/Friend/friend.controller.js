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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFriend = exports.getMyFriends = exports.makeFriend = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const friend_constant_1 = require("./friend.constant");
const friend_service_1 = require("./friend.service");
const makeFriend = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { friendId } = req.body;
    const result = yield (0, friend_service_1.makeFriendService)(loginUserId, friendId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Friend is made successfully",
        data: result,
    });
}));
exports.makeFriend = makeFriend;
const getMyFriends = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, friend_constant_1.FriendValidFields);
    const result = yield (0, friend_service_1.getMyFriendsService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Friends are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
exports.getMyFriends = getMyFriends;
const removeFriend = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { friendId } = req.body;
    const result = yield (0, friend_service_1.removeFriendService)(loginUserId, friendId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Friend is removed successfully",
        data: result,
    });
}));
exports.removeFriend = removeFriend;
