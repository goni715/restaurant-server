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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const restaurant_constant_1 = require("./restaurant.constant");
const restaurant_service_1 = require("./restaurant.service");
const createRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, restaurant_service_1.createRestaurantService)(req, loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Restaurant is created successfully",
        data: result
    });
}));
const getRestaurants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, restaurant_constant_1.RestaurantValidFields);
    const result = yield (0, restaurant_service_1.getRestaurantsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurants are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getUserRestaurants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, restaurant_constant_1.UserRestaurantValidFields);
    const result = yield (0, restaurant_service_1.getUserRestaurantsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurants are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getOwnerRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, restaurant_service_1.getOwnerRestaurantService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant is retrieved successfully",
        data: result
    });
}));
const getSingleRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const result = yield (0, restaurant_service_1.getSingleRestaurantService)(restaurantId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant is retrieved successfully",
        data: result
    });
}));
const changeRestaurantStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const result = yield (0, restaurant_service_1.changeRestaurantStatusService)(restaurantId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant status is changed successfully",
        data: result,
    });
}));
const approveRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const { approved } = req.body;
    const result = yield (0, restaurant_service_1.approveRestaurantService)(restaurantId, approved);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant Approval is updated successfully",
        data: result,
    });
}));
const updateRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, restaurant_service_1.updateRestaurantService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant is updated successfully",
        data: result,
    });
}));
const updateRestaurantImg = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, restaurant_service_1.updateRestaurantImgService)(req, loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant's image is updated successfully",
        data: result,
    });
}));
const deleteRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, restaurant_service_1.deleteRestaurantService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Restaurant is deleted successfully",
        data: result,
    });
}));
const RestaurantController = {
    createRestaurant,
    getRestaurants,
    getUserRestaurants,
    getOwnerRestaurant,
    changeRestaurantStatus,
    getSingleRestaurant,
    approveRestaurant,
    updateRestaurant,
    updateRestaurantImg,
    deleteRestaurant
};
exports.default = RestaurantController;
