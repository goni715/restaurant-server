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
const dining_constant_1 = require("./dining.constant");
const dining_service_1 = require("./dining.service");
const createDining = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield (0, dining_service_1.createDiningService)(name);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Dining is created successfully",
        data: result
    });
}));
const getDiningList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, dining_constant_1.DiningValidFields);
    const result = yield (0, dining_service_1.getDiningListService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Dinings are retrived successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getDiningDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, dining_service_1.getDiningDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Dinings are retrived successfully",
        data: result
    });
}));
const getMyDinings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, dining_service_1.getMyDiningsService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Dinings are retrived successfully",
        data: result
    });
}));
const updateDining = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { diningId } = req.params;
    const { name } = req.body;
    const result = yield (0, dining_service_1.updateDiningService)(diningId, name);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Dining is updated successfully",
        data: result
    });
}));
const deleteDining = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { diningId } = req.params;
    const result = yield (0, dining_service_1.deleteDiningService)(diningId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Dining is deleted successfully",
        data: result
    });
}));
const DiningController = {
    createDining,
    getDiningList,
    getDiningDropDown,
    getMyDinings,
    updateDining,
    deleteDining
};
exports.default = DiningController;
