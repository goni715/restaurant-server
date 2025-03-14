"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAnswerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const quizAnswer_controller_1 = require("./quizAnswer.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const quizAnswer_validation_1 = require("./quizAnswer.validation");
const router = express_1.default.Router();
router.post('/submit-quiz-answer', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(quizAnswer_validation_1.submitQuizAnswerSchema), quizAnswer_controller_1.submitQuizAnswer);
router.get('/get-quiz-results/:type', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.user), quizAnswer_controller_1.getQuizResults);
router.get('/get-my-quiz-history', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), quizAnswer_controller_1.getMyQuizHistory);
router.put('/calculate-xp', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin), quizAnswer_controller_1.calculateXP);
exports.QuizAnswerRoutes = router;
