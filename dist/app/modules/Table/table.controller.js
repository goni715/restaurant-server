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
const table_constant_1 = require("./table.constant");
const table_service_1 = require("./table.service");
const createTable = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, table_service_1.createTableService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Table is created successfully",
        data: result
    });
}));
const getTables = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, table_constant_1.TableValidFields);
    const result = yield (0, table_service_1.getTablesService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Tables are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getTablesByScheduleAndDining = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { scheduleId, diningId } = req.params;
    const result = yield (0, table_service_1.getTablesByScheduleAndDiningService)(loginUserId, scheduleId, diningId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Tables are retrieved successfully",
        data: result
    });
}));
const TableController = {
    createTable,
    getTables,
    getTablesByScheduleAndDining
};
exports.default = TableController;
