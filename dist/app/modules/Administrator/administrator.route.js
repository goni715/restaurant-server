"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministratorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const administrator_controller_1 = __importDefault(require("./administrator.controller"));
const administrator_validation_1 = require("./administrator.validation");
const upload_1 = __importDefault(require("../../helper/upload"));
const router = express_1.default.Router();
router.post("/create-administrator", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin), upload_1.default.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationMiddleware_1.default)(administrator_validation_1.createAdministratorSchema), administrator_controller_1.default.createAdministrator);
router.patch("/update-administrator-access/:administratorId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(administrator_validation_1.updateAdministratorAccessSchema), administrator_controller_1.default.updateAccess);
router.patch("/update-administrator/:userId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(administrator_validation_1.updateAdministratorSchema), administrator_controller_1.default.updateAdministrator);
router.get("/get-administrators", (0, AuthMiddleware_1.default)("super_admin", "administrator"), administrator_controller_1.default.getAdministrators);
router.delete("/delete-administrator/:administratorId", (0, AuthMiddleware_1.default)("super_admin"), administrator_controller_1.default.deleteAdministrator);
router.get("/get-single-administrator/:administratorId", (0, AuthMiddleware_1.default)("super_admin"), administrator_controller_1.default.getSingleAdministrator);
exports.AdministratorRoutes = router;
