"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("./quiz.controller");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const quiz_validation_1 = require("./quiz.validation");
const router = express_1.default.Router();
router.post('/create-quiz', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin), (0, validateRequest_1.default)(quiz_validation_1.createQuizSchema), quiz_controller_1.createQuiz);
router.get('/get-all-quiz', quiz_controller_1.getAllQuiz);
router.delete('/delete-quiz/:quizId', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin), quiz_controller_1.deleteQuiz);
router.get('/get-single-quiz/:quizId', quiz_controller_1.getSingleQuiz);
exports.QuizRoutes = router;
