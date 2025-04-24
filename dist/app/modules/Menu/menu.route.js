"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const menu_controller_1 = __importDefault(require("./menu.controller"));
const menu_validation_1 = require("./menu.validation");
const upload_1 = __importDefault(require("../../helper/upload"));
const router = express_1.default.Router();
router.post("/create-menu", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), upload_1.default.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationMiddleware_1.default)(menu_validation_1.createMenuValidationSchema), menu_controller_1.default.createMenu);
router.get("/get-menus", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), menu_controller_1.default.getMenus);
router.get("/get-menus-by-restaurant-id/:restaurantId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), menu_controller_1.default.getMenusByRestaurantId);
router.patch("/update-menu/:menuId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), upload_1.default.single('file'), (0, validationMiddleware_1.default)(menu_validation_1.updateMenuValidationSchema), menu_controller_1.default.updateMenu);
router.delete("/delete-menu/:menuId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), menu_controller_1.default.deleteMenu);
exports.MenuRoutes = router;
