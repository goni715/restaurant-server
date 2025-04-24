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
const schedule_constant_1 = require("./schedule.constant");
const schedule_service_1 = require("./schedule.service");
const createSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, schedule_service_1.createScheduleService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully",
        data: result
    });
}));
const getSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, schedule_constant_1.ScheduleValidFields);
    const result = yield (0, schedule_service_1.getSchedulesService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedules are retrived successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getScheduleDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, schedule_constant_1.ScheduleDropDownValidFields);
    const result = yield (0, schedule_service_1.getScheduleDropDownService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedules are retrived successfully",
        data: result
    });
}));
const getUserSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, schedule_constant_1.UserScheduleValidFields);
    const result = yield (0, schedule_service_1.getUserSchedulesService)(restaurantId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedules are retrived successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getSingleSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { scheduleId } = req.params;
    const result = yield (0, schedule_service_1.getSingleScheduleService)(scheduleId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedule is retrived successfully",
        data: result
    });
}));
const deleteSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { scheduleId } = req.params;
    const result = yield (0, schedule_service_1.deleteScheduleService)(loginUserId, scheduleId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedule is deleted successfully",
        data: result
    });
}));
const ScheduleController = {
    createSchedule,
    getSchedules,
    getScheduleDropDown,
    getUserSchedules,
    getSingleSchedule,
    deleteSchedule
};
exports.default = ScheduleController;
