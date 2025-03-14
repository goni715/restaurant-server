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
exports.updateInfo = exports.getAllInfo = exports.deleteInfo = exports.createInfo = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const info_constant_1 = require("./info.constant");
const info_service_1 = require("./info.service");
const createInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, info_service_1.createInfoService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Info is created successfully",
        data: result,
    });
}));
exports.createInfo = createInfo;
const deleteInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const infoId = req.params.infoId;
    const result = yield (0, info_service_1.deleteInfoService)(infoId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Info is deleted successfully",
        data: result
    });
}));
exports.deleteInfo = deleteInfo;
const getAllInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, info_constant_1.InfoValidFields);
    const result = yield (0, info_service_1.getAllInfoService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Informations are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
exports.getAllInfo = getAllInfo;
const updateInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const infoId = req.params.infoId;
    const result = yield (0, info_service_1.updateInfoService)(infoId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Info is updated successfully",
        data: result
    });
}));
exports.updateInfo = updateInfo;
