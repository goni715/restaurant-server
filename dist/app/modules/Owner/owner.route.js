"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const upload_1 = __importDefault(require("../../helper/upload"));
const owner_controller_1 = __importDefault(require("./owner.controller"));
const owner_validation_1 = require("./owner.validation");
const router = express_1.default.Router();
router.post("/create-owner", upload_1.default.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validationMiddleware_1.default)(owner_validation_1.createOwnerValidationSchema), owner_controller_1.default.createOwner);
exports.OwnerRoutes = router;
