"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const info_controller_1 = require("./info.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const info_validation_1 = require("./info.validation");
const router = express_1.default.Router();
router.post('/create-info', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin), (0, validateRequest_1.default)(info_validation_1.createInfoSchema), info_controller_1.createInfo);
router.delete('/delete-info/:infoId', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin), info_controller_1.deleteInfo);
router.get('/get-all-info', info_controller_1.getAllInfo);
router.put('/update-info/:infoId', info_controller_1.updateInfo);
exports.InfoRoutes = router;
