"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const menuReview_controller_1 = __importDefault(require("./menuReview.controller"));
const menuReview_validation_1 = require("./menuReview.validation");
const router = express_1.default.Router();
router.post("/create-menu-review", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(menuReview_validation_1.createMenuReviewValidationSchema), menuReview_controller_1.default.createMenuReview);
router.delete("/delete-menu-review/:reviewId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), menuReview_controller_1.default.deleteMenuReview);
router.get("/get-menu-reviews/:menuId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), menuReview_controller_1.default.getMenuReviews);
exports.MenuReviewRoutes = router;
