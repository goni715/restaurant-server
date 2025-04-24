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
const cuisine_constant_1 = require("./cuisine.constant");
const cuisine_service_1 = require("./cuisine.service");
const createCuisine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield (0, cuisine_service_1.createCuisineService)(req, name);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Cuisine is created successfully",
        data: result
    });
}));
const getCuisines = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, cuisine_constant_1.CuisineValidFields);
    const result = yield (0, cuisine_service_1.getCuisinesService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cuisines are retrived successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getCuisineDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, cuisine_service_1.getCuisineDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cuisines are retrived successfully",
        data: result
    });
}));
const updateCuisine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cuisineId } = req.params;
    const result = yield (0, cuisine_service_1.updateCuisineService)(req, cuisineId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cuisine is updated successfully",
        data: result
    });
}));
const deleteCuisine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cuisineId } = req.params;
    const result = yield (0, cuisine_service_1.deleteCuisineService)(cuisineId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cuisine is deleted successfully",
        data: result
    });
}));
const CuisineController = {
    createCuisine,
    getCuisines,
    getCuisineDropDown,
    updateCuisine,
    deleteCuisine
};
exports.default = CuisineController;
