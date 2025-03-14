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
exports.calculateXP = exports.getMyQuizHistory = exports.getQuizResults = exports.submitQuizAnswer = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const quizAnswer_constant_1 = require("./quizAnswer.constant");
const quizAnswer_service_1 = require("./quizAnswer.service");
const submitQuizAnswer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, quizAnswer_service_1.submitQuizAnswerService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz Answer is submitted successfully",
        data: result
    });
}));
exports.submitQuizAnswer = submitQuizAnswer;
const getQuizResults = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    const result = yield (0, quizAnswer_service_1.getQuizResultsService)(type);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Quiz result retrieved successfully",
        data: result
    });
}));
exports.getQuizResults = getQuizResults;
const getMyQuizHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, quizAnswer_constant_1.HistoryValidFields);
    const result = yield (0, quizAnswer_service_1.getMyQuizHistoryService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Quiz History retrieved successfully",
        data: result
    });
}));
exports.getMyQuizHistory = getMyQuizHistory;
const calculateXP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, quizAnswer_service_1.calculateXPService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "XP is calculated successfully",
        data: result,
    });
}));
exports.calculateXP = calculateXP;
