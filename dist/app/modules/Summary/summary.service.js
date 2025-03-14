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
exports.getSummaryService = void 0;
const quiz_model_1 = __importDefault(require("../Quiz/quiz.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
const getSummaryService = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield user_model_1.default.countDocuments();
    const totalQuizzes = yield quiz_model_1.default.countDocuments();
    return {
        totalUsers,
        totalQuizzes
    };
});
exports.getSummaryService = getSummaryService;
