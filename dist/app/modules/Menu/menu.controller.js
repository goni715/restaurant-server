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
const menu_constant_1 = require("./menu.constant");
const menu_service_1 = require("./menu.service");
const createMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, menu_service_1.createMenuService)(req, loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Menu is created successfully",
        data: result,
    });
}));
const getMenus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, menu_constant_1.MenuValidFields);
    const result = yield (0, menu_service_1.getMenusService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Menus are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getMenusByRestaurantId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, menu_constant_1.MenuValidFields);
    const result = yield (0, menu_service_1.getMenusByRestaurantIdService)(restaurantId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Menus are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { menuId } = req.params;
    const result = yield (0, menu_service_1.updateMenuService)(req, loginUserId, menuId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Menu is updated successfully",
        data: result,
    });
}));
const deleteMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { menuId } = req.params;
    const result = yield (0, menu_service_1.deleteMenuService)(loginUserId, menuId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Menu is deleted successfully",
        data: result,
    });
}));
const MenuController = {
    createMenu,
    getMenus,
    getMenusByRestaurantId,
    updateMenu,
    deleteMenu
};
exports.default = MenuController;
