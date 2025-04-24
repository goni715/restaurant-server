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
const menuReview_constant_1 = require("./menuReview.constant");
const menuReview_service_1 = require("./menuReview.service");
const createMenuReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, menuReview_service_1.createMenuReviewService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Review is created successfully",
        data: result,
    });
}));
const deleteMenuReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const result = yield (0, menuReview_service_1.deleteMenuReviewService)(reviewId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review is deleted successfully",
        data: result,
    });
}));
const getMenuReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { menuId } = req.params;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, menuReview_constant_1.MenuReviewValidFields);
    const result = yield (0, menuReview_service_1.getMenuReviewsService)(menuId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Menu's reviews are retrived successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const MenuReviewController = {
    createMenuReview,
    deleteMenuReview,
    getMenuReviews
};
exports.default = MenuReviewController;
