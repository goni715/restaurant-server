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
const administrator_constant_1 = require("./administrator.constant");
const administrator_service_1 = require("./administrator.service");
const createAdministrator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, administrator_service_1.createAdministratorService)(req, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Administrator is created successfully",
        data: result,
    });
}));
const updateAccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { administratorId } = req.params;
    const { access } = req.body;
    const result = yield (0, administrator_service_1.updateAccessService)(administratorId, access);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Administrator is updated successfully",
        data: result,
    });
}));
const updateAdministrator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield (0, administrator_service_1.updateAdministratorService)(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Administrator is updated successfully",
        data: result,
    });
}));
const getAdministrators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, administrator_constant_1.AdministratorValidFields);
    const result = yield (0, administrator_service_1.getAdministratorsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Administrators are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const deleteAdministrator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { administratorId } = req.params;
    const result = yield (0, administrator_service_1.deleteAdministratorService)(administratorId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Administrator is deleted successfully",
        data: result,
    });
}));
const getSingleAdministrator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { administratorId } = req.params;
    const result = yield (0, administrator_service_1.getSingleAdministratorService)(administratorId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Administrator is retrieved successfully",
        data: result,
    });
}));
const AdministratorController = {
    createAdministrator,
    updateAccess,
    updateAdministrator,
    getAdministrators,
    deleteAdministrator,
    getSingleAdministrator
};
exports.default = AdministratorController;
