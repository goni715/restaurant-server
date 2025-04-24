"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const favourite_controller_1 = __importDefault(require("./favourite.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const favourite_validation_1 = require("./favourite.validation");
const router = express_1.default.Router();
router.post('/add-or-remove-favourite', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(favourite_validation_1.addOrRemoveFavouriteSchema), favourite_controller_1.default.addOrRemoveFavourite);
router.get('/get-favourite-list', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), favourite_controller_1.default.getFavouriteList);
exports.FavouriteRoutes = router;
