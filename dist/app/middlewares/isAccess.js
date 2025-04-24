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
const administrator_model_1 = __importDefault(require("../modules/Administrator/administrator.model"));
const isAccess = (access) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const loginUserId = req.headers.id;
        const role = req.headers.role;
        const AccessRoles = ["super_admin", "administrator"];
        //check if role is not super_admin or administrator
        if (!AccessRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "You have no access",
                error: {
                    message: "You have no access",
                },
            });
        }
        //check if role is administrator
        if (role === "administrator") {
            const administrator = yield administrator_model_1.default.findOne({
                userId: loginUserId
            });
            const accessList = administrator === null || administrator === void 0 ? void 0 : administrator.access;
            if (!(accessList === null || accessList === void 0 ? void 0 : accessList.includes(access))) {
                return res.status(403).json({
                    success: false,
                    message: "You have no access",
                    error: {
                        message: "You have no access",
                    },
                });
            }
            return next();
        }
        if (role === "super_admin") {
            return next();
        }
    });
};
exports.default = isAccess;
