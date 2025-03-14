"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const quiz_route_1 = require("../modules/Quiz/quiz.route");
const summary_route_1 = require("../modules/Summary/summary.route");
const info_route_1 = require("../modules/Info/info.route");
const friend_route_1 = require("../modules/Friend/friend.route");
const gameSession_route_1 = require("../modules/GameSession/gameSession.route");
const quizAnswer_route_1 = require("../modules/QuizAnswer/quizAnswer.route");
const randomSession_route_1 = require("../modules/RandomSession/randomSession.route");
const review_route_1 = require("../modules/Review/review.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/quiz',
        route: quiz_route_1.QuizRoutes
    },
    {
        path: '/quiz-answer',
        route: quizAnswer_route_1.QuizAnswerRoutes
    },
    {
        path: '/summary',
        route: summary_route_1.SummaryRoutes
    },
    {
        path: '/info',
        route: info_route_1.InfoRoutes
    },
    {
        path: '/friend',
        route: friend_route_1.FriendRoutes
    },
    {
        path: '/game-session',
        route: gameSession_route_1.GameSessionRoutes
    },
    {
        path: '/random-session',
        route: randomSession_route_1.RandomSessionRoutes
    },
    {
        path: '/review',
        route: review_route_1.ReviewRoutes
    }
];
moduleRoutes.forEach((item, i) => router.use(item.path, item.route));
exports.default = router;
