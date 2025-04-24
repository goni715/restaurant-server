"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const restaurant_controller_1 = __importDefault(require("./restaurant.controller"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const restaurant_validation_1 = require("./restaurant.validation");
const upload_1 = __importDefault(require("../../helper/upload"));
const isAccess_1 = __importDefault(require("../../middlewares/isAccess"));
const router = express_1.default.Router();
router.post("/create-restaurant", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), upload_1.default.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationMiddleware_1.default)(restaurant_validation_1.createRestaurantValidationSchema), restaurant_controller_1.default.createRestaurant);
router.get("/get-restaurants", (0, AuthMiddleware_1.default)("super_admin", "administrator"), restaurant_controller_1.default.getRestaurants);
router.get("/get-single-restaurant/:restaurantId", (0, AuthMiddleware_1.default)("super_admin", "administrator", "user"), restaurant_controller_1.default.getSingleRestaurant);
router.get("/get-user-restaurants", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), restaurant_controller_1.default.getUserRestaurants);
router.get("/get-owner-restaurants", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), restaurant_controller_1.default.getOwnerRestaurant);
router.patch("/change-restaurant-status/:restaurantId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.administrator), (0, isAccess_1.default)("restaurant"), (0, validationMiddleware_1.default)(restaurant_validation_1.changeRestaurantStatusSchema), restaurant_controller_1.default.changeRestaurantStatus);
router.patch("/approve-restaurant/:restaurantId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.administrator), (0, isAccess_1.default)("restaurant"), (0, validationMiddleware_1.default)(restaurant_validation_1.approveRestaurantSchema), restaurant_controller_1.default.approveRestaurant);
router.patch("/update-restaurant", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), (0, validationMiddleware_1.default)(restaurant_validation_1.updateRestaurantValidationSchema), restaurant_controller_1.default.updateRestaurant);
router.delete("/delete-restaurant", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), restaurant_controller_1.default.deleteRestaurant);
exports.RestaurantRoutes = router;
