"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = __importDefault(require("./user.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const user_validation_1 = require("./user.validation");
const upload_1 = __importDefault(require("../../helper/upload"));
const router = express_1.default.Router();
router.post("/create-user", upload_1.default.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationMiddleware_1.default)(user_validation_1.createUserValidationSchema), user_controller_1.default.createUser);
router.get("/get-users", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.administrator), user_controller_1.default.getUsers);
router.get("/get-single-user/:id", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.owner, user_constant_1.UserRole.administrator), user_controller_1.default.getSingleUser);
router.get("/get-me", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.owner, user_constant_1.UserRole.user, user_constant_1.UserRole.administrator), user_controller_1.default.getMe);
router.get("/get-me-for-super-admin", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.administrator), user_controller_1.default.getMeForSuperAdmin);
router.patch("/edit-my-profile", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.owner, user_constant_1.UserRole.user, user_constant_1.UserRole.administrator), upload_1.default.single('file'), (0, validationMiddleware_1.default)(user_validation_1.updateProfileValidationSchema), user_controller_1.default.editMyProfile);
router.patch("/update-profile-img", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.owner, user_constant_1.UserRole.user, user_constant_1.UserRole.administrator), upload_1.default.single('file'), user_controller_1.default.updateProfileImg);
exports.UserRoutes = router;
