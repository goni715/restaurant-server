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
exports.addToReviewService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const quiz_model_1 = __importDefault(require("../Quiz/quiz.model"));
const review_model_1 = __importDefault(require("./review.model"));
const addToReviewService = (loginUserId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield quiz_model_1.default.findById(quizId);
    if (!quiz) {
        throw new AppError_1.default(404, "Quiz not found");
    }
    const result = yield review_model_1.default.create();
    return {
        loginUserId,
        quizId
    };
});
exports.addToReviewService = addToReviewService;
