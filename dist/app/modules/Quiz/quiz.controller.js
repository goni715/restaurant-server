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
exports.getSingleQuiz = exports.getAllQuiz = exports.deleteQuiz = exports.createQuiz = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const quiz_constant_1 = require("./quiz.constant");
const quiz_service_1 = require("./quiz.service");
const createQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, quiz_service_1.createQuizService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz is created successfully",
        data: result
    });
}));
exports.createQuiz = createQuiz;
const deleteQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = req.params.quizId;
    const result = yield (0, quiz_service_1.deleteQuizService)(quizId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Quiz is deleted successfully",
        data: result,
    });
}));
exports.deleteQuiz = deleteQuiz;
const getAllQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, quiz_constant_1.QuizValidFields);
    const result = yield (0, quiz_service_1.getAllQuizService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Quizs are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
exports.getAllQuiz = getAllQuiz;
const getSingleQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = req.params.quizId;
    const result = yield (0, quiz_service_1.getSingleQuizService)(quizId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Quiz is retrieved successfully",
        data: result
    });
}));
exports.getSingleQuiz = getSingleQuiz;
